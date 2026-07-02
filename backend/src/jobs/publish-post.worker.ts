import { Worker, Job } from "bullmq";
import { prisma } from "../config/db.js";
import { triggerWebhook } from "../services/webhook.service.js";

const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

/**
 * BullMQ Worker processing social post publication
 */
export const postWorker = new Worker(
  "social-posts",
  async (job: Job) => {
    const { postId } = job.data;
    console.log(`[Worker] Started processing job ${job.id} for post ${postId}`);

    try {
      // 1. Fetch post details from PostgreSQL
      const post = await prisma.post.findUnique({
        where: { id: postId },
        include: { captions: true },
      });

      if (!post) {
        console.error(`[Worker] Post ${postId} not found in database.`);
        return;
      }

      if (post.status !== "SCHEDULED") {
        console.log(`[Worker] Post ${postId} status is ${post.status}. Skipping.`);
        return;
      }

      // 2. Mark post as publishing
      await prisma.post.update({
        where: { id: postId },
        data: { status: "IN_PROGRESS" },
      });

      console.log(`[Worker] Publishing post content to platforms: ${post.platforms.join(", ")}`);
      console.log(`[Worker] Caption: "${post.captions[0]?.generatedText || ""}"`);

      // 3. Simulate latency to post to external social APIs (LinkedIn, Twitter, etc.)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 4. Update status to PUBLISHED
      await prisma.post.update({
        where: { id: postId },
        data: {
          status: "PUBLISHED",
          publishedAt: new Date(),
        },
      });

      console.log(`[Worker] Successfully published post ${postId}`);
      await triggerWebhook("post.published", { postId, platforms: post.platforms });
    } catch (err: any) {
      console.error(`[Worker] Failed to process post ${postId}:`, err.message);
      
      // Update status to FAILED
      await prisma.post.update({
        where: { id: postId },
        data: { status: "FAILED" },
      });

      await triggerWebhook("post.failed", { postId, error: err.message });
      throw err; // Signal failure to BullMQ for retry rules
    }
  },
  {
    connection: {
      host: "127.0.0.1",
      port: 6379,
    },
  }
);

postWorker.on("completed", (job) => {
  console.log(`[Worker] Job ${job.id} completed successfully`);
});

postWorker.on("failed", (job, err) => {
  console.error(`[Worker] Job ${job?.id} failed:`, err.message);
});
