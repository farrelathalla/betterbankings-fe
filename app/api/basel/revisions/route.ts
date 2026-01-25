import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

// GET /api/basel/revisions - List revisions (filter by subsectionId)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subsectionId = searchParams.get("subsectionId");

    if (!subsectionId) {
      return NextResponse.json(
        { error: "subsectionId is required" },
        { status: 400 },
      );
    }

    const revisions = await prisma.baselRevision.findMany({
      where: { subsectionId },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ revisions });
  } catch (error) {
    console.error("Error fetching revisions:", error);
    return NextResponse.json(
      { error: "Failed to fetch revisions" },
      { status: 500 },
    );
  }
}

// POST /api/basel/revisions - Create new revision (admin only)
export async function POST(request: Request) {
  try {
    const adminError = await requireAdmin();
    if (adminError) return adminError;

    const body = await request.json();
    const { title, content, revisionDate, subsectionId, order } = body;

    if (!title || !content || !revisionDate || !subsectionId) {
      return NextResponse.json(
        {
          error: "Title, content, revisionDate, and subsectionId are required",
        },
        { status: 400 },
      );
    }

    const revision = await prisma.baselRevision.create({
      data: {
        title,
        content,
        revisionDate: new Date(revisionDate),
        subsectionId,
        order: order || 0,
      },
    });

    return NextResponse.json({ revision }, { status: 201 });
  } catch (error) {
    console.error("Error creating revision:", error);
    return NextResponse.json(
      { error: "Failed to create revision" },
      { status: 500 },
    );
  }
}
