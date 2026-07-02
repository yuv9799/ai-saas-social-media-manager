import { Queue, QueueOptions } from "bullmq";

const queueOptions: QueueOptions = {
  connection: {
    host: "127.0.0.1",
    port: 6379,
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
};

// Initialize BullMQ Queue
export const postQueue = new Queue("social-posts", queueOptions);

/**
 * Schedule a social media post job
 * @param postId ID of the post
 * @param delayMs Milliseconds to delay publication
 */
export async function schedulePostPublication(postId: string, delayMs: number) {
  try {
    const job = await postQueue.add(
      "publish",
      { postId },
      { delay: delayMs }
    );
    console.log(`Successfully scheduled post job ${job.id} for post ${postId} with delay ${delayMs}ms`);
    return job;
  } catch (error) {
    console.error(`Failed to schedule post job for post ${postId}:`, error);
    throw error;
  }
}
