import { Request, Response } from "express";
import { prisma } from "../config/db.js";

// Create a new brand voice setting
export async function createBrandVoice(req: Request, res: Response) {
  try {
    const { name, guidelines, referenceTexts } = req.body;

    if (!name || !guidelines) {
      return res.status(400).json({ error: "Name and guidelines are required" });
    }

    // Find default workspace to attach to
    let workspace = await prisma.workspace.findFirst();
    if (!workspace) {
      workspace = await prisma.workspace.create({
        data: { name: "Default Workspace" },
      });
    }

    const brandVoice = await prisma.brandVoice.create({
      data: {
        workspaceId: workspace.id,
        name,
        guidelines,
        referenceTexts: referenceTexts || [],
      },
    });

    return res.status(201).json({ message: "Brand voice created successfully", brandVoice });
  } catch (error: any) {
    console.error("Create Brand Voice Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Get all brand voices in workspace
export async function getBrandVoices(req: Request, res: Response) {
  try {
    const voices = await prisma.brandVoice.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.json({ voices });
  } catch (error: any) {
    console.error("Get Brand Voices Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Update brand voice
export async function updateBrandVoice(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, guidelines, referenceTexts } = req.body;

    const voice = await prisma.brandVoice.findUnique({ where: { id } });
    if (!voice) {
      return res.status(404).json({ error: "Brand voice not found" });
    }

    const updated = await prisma.brandVoice.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(guidelines && { guidelines }),
        ...(referenceTexts && { referenceTexts }),
      },
    });

    return res.json({ message: "Brand voice updated successfully", brandVoice: updated });
  } catch (error: any) {
    console.error("Update Brand Voice Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Delete brand voice
export async function deleteBrandVoice(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const voice = await prisma.brandVoice.findUnique({ where: { id } });
    if (!voice) {
      return res.status(404).json({ error: "Brand voice not found" });
    }

    await prisma.brandVoice.delete({ where: { id } });
    return res.json({ message: "Brand voice deleted successfully" });
  } catch (error: any) {
    console.error("Delete Brand Voice Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
