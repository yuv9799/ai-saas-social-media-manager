import { Response } from "express";
import { prisma } from "../config/db.js";
import { AuthenticatedRequest } from "../middlewares/auth.middleware.js";

// Create a new brand workspace
export async function createWorkspace(req: AuthenticatedRequest, res: Response) {
  try {
    const { name, logo } = req.body;
    const userId = req.auth?.userId;

    if (!name) {
      return res.status(400).json({ error: "Workspace name is required" });
    }

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: Missing user identity" });
    }

    // 1. Create workspace
    const workspace = await prisma.workspace.create({
      data: {
        name,
        logo,
      },
    });

    // 2. Add creator as OWNER membership link
    await prisma.workspaceMember.create({
      data: {
        workspaceId: workspace.id,
        userId,
        role: "OWNER",
      },
    });

    return res.status(201).json({ message: "Workspace created successfully", workspace });
  } catch (error: any) {
    console.error("Create Workspace Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Get user workspaces list
export async function getWorkspaces(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const memberships = await prisma.workspaceMember.findMany({
      where: { userId },
      include: {
        workspace: {
          include: {
            subscription: true,
          },
        },
      },
    });

    const workspaces = memberships.map((m: any) => m.workspace);
    return res.json({ workspaces });
  } catch (error: any) {
    console.error("Get Workspaces Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Invite team member
export async function inviteMember(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params; // workspace ID
    const { email, role } = req.body;
    const userId = req.auth?.userId;

    if (!email || !role) {
      return res.status(400).json({ error: "Email and role are required" });
    }

    // Verify requesting user is owner/admin of workspace
    const membership = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: id,
          userId: userId || "",
        },
      },
    });

    if (!membership || (membership.role !== "OWNER" && membership.role !== "ADMIN")) {
      return res.status(403).json({ error: "Forbidden: Insufficient privileges" });
    }

    // Find or create target user record
    let targetUser = await prisma.user.findUnique({ where: { email } });
    if (!targetUser) {
      targetUser = await prisma.user.create({
        data: {
          id: `invited_${Date.now()}`,
          email,
        },
      });
    }

    // Create membership connection
    const newMember = await prisma.workspaceMember.create({
      data: {
        workspaceId: id,
        userId: targetUser.id,
        role: role.toUpperCase(),
      },
    });

    return res.status(201).json({ message: "Member invited successfully", member: newMember });
  } catch (error: any) {
    console.error("Invite Member Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
