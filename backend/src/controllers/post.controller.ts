import { Request, Response } from "express";
import { prisma } from "../config/db.js";
import { schedulePostPublication } from "../services/queue.service.js";

// Create scheduled or draft post
export async function createPost(req: Request, res: Response) {
  try {
    const { content, platforms, scheduledAt, topic, imageUrl, imagePrompt } = req.body;

    if (!content || !platforms || !Array.isArray(platforms) || platforms.length === 0) {
      return res.status(400).json({ error: "Content and at least one platform are required" });
    }

    // 1. Find or create a default workspace for testing/development
    let workspace = await prisma.workspace.findFirst();
    if (!workspace) {
      workspace = await prisma.workspace.create({
        data: { name: "Default Workspace" },
      });
    }

    // 2. Find or create a default user for testing/development
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: "user_test_default",
          email: "test@example.com",
          firstName: "Test",
          lastName: "User",
        },
      });
    }

    // Determine status: Draft vs Scheduled vs Published (if no schedule date, assume publish immediately)
    const isScheduled = !!scheduledAt;
    const postStatus = isScheduled ? "SCHEDULED" : "PUBLISHED";

    // 3. Create post with captions and images
    const post = await prisma.post.create({
      data: {
        workspaceId: workspace.id,
        userId: user.id,
        status: postStatus,
        platforms: platforms.map((p: string) => p.toUpperCase()),
        scheduledAt: isScheduled ? new Date(scheduledAt) : null,
        publishedAt: isScheduled ? null : new Date(),
        captions: {
          create: {
            topic: topic || "Manual entry",
            generatedText: content,
          },
        },
        ...(imageUrl && {
          images: {
            create: {
              prompt: imagePrompt || "Manual Upload",
              url: imageUrl,
            },
          },
        }),
      },
      include: {
        captions: true,
        images: true,
      },
    });

    // 4. Enqueue in BullMQ if scheduled for future
    if (isScheduled) {
      const delayMs = new Date(scheduledAt).getTime() - Date.now();
      if (delayMs > 0) {
        await schedulePostPublication(post.id, delayMs);
      }
    }

    return res.status(201).json({ message: "Post created successfully", post });
  } catch (error: any) {
    console.error("Create Post Error:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}

// Retrieve list of posts
export async function getPosts(req: Request, res: Response) {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        captions: true,
        images: true,
      },
    });

    return res.json({ posts });
  } catch (error: any) {
    console.error("Get Posts Error:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}

// Delete post
export async function deletePost(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    await prisma.post.delete({ where: { id } });

    return res.json({ message: "Post deleted successfully" });
  } catch (error: any) {
    console.error("Delete Post Error:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}

// Update post (e.g. date rescheduling)
export async function updatePost(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { scheduledAt, status, content } = req.body;

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const updated = await prisma.post.update({
      where: { id },
      data: {
        ...(scheduledAt !== undefined && { scheduledAt: scheduledAt ? new Date(scheduledAt) : null }),
        ...(status && { status: status.toUpperCase() }),
        ...(content && {
          captions: {
            updateMany: {
              where: { postId: id },
              data: { generatedText: content },
            },
          },
        }),
      },
    });

    return res.json({ message: "Post updated successfully", post: updated });
  } catch (error: any) {
    console.error("Update Post Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
