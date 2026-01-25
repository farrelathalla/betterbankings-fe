import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

// GET /api/basel/revisions/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const revision = await prisma.baselRevision.findUnique({
      where: { id },
      include: {
        subsection: {
          include: {
            section: {
              include: {
                chapter: {
                  include: {
                    standard: { select: { code: true, name: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!revision) {
      return NextResponse.json(
        { error: "Revision not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ revision });
  } catch (error) {
    console.error("Error fetching revision:", error);
    return NextResponse.json(
      { error: "Failed to fetch revision" },
      { status: 500 },
    );
  }
}

// PUT /api/basel/revisions/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const adminError = await requireAdmin();
    if (adminError) return adminError;

    const { id } = await params;
    const body = await request.json();
    const { title, content, revisionDate, order } = body;

    const revision = await prisma.baselRevision.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(content !== undefined && { content }),
        ...(revisionDate && { revisionDate: new Date(revisionDate) }),
        ...(order !== undefined && { order }),
      },
    });

    return NextResponse.json({ revision });
  } catch (error) {
    console.error("Error updating revision:", error);
    return NextResponse.json(
      { error: "Failed to update revision" },
      { status: 500 },
    );
  }
}

// DELETE /api/basel/revisions/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const adminError = await requireAdmin();
    if (adminError) return adminError;

    const { id } = await params;

    await prisma.baselRevision.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting revision:", error);
    return NextResponse.json(
      { error: "Failed to delete revision" },
      { status: 500 },
    );
  }
}
