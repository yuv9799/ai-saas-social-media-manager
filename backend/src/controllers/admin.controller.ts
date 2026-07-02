import { Request, Response } from "express";
import { prisma } from "../config/db.js";

/**
 * Retrieve system workspace audit logs
 */
export async function getAuditLogs(req: Request, res: Response) {
  try {
    // If no audit logs exist, seed a dummy audit log for dev testing
    const count = await prisma.auditLog.count();
    if (count === 0) {
      let workspace = await prisma.workspace.findFirst();
      if (!workspace) {
        workspace = await prisma.workspace.create({ data: { name: "Default Workspace" } });
      }
      let user = await prisma.user.findFirst();
      if (!user) {
        user = await prisma.user.create({
          data: {
            id: "user_test_default",
            email: "test@example.com",
            firstName: "Admin",
            lastName: "Tester",
          },
        });
      }
      await prisma.auditLog.create({
        data: {
          workspaceId: workspace.id,
          userId: user.id,
          action: "SYSTEM_INIT",
          details: "Admin panel initialized and seeded.",
        },
      });
    }

    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 30,
      include: {
        user: true,
        workspace: true,
      },
    });

    return res.json({ logs });
  } catch (error: any) {
    console.error("Admin Audit Logs Error:", error.message);
    return res.status(500).json({ error: "Failed to load audit logs", details: error.message });
  }
}
