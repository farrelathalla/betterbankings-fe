import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";

// API Base URL for backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

// DELETE /api/basel/pdfs/[id] - Delete PDF (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminError = await requireAdmin();
    if (adminError) return adminError;

    const { id } = await params;

    // Delete PDF record from backend (which returns filename for VPS deletion)
    const deleteRes = await fetch(`${API_URL}/basel/chapters/pdfs/${id}`, {
      method: "DELETE",
      headers: {
        Cookie: request.headers.get("cookie") || "",
      },
    });

    if (!deleteRes.ok) {
      const error = await deleteRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: error.error || "PDF not found" },
        { status: deleteRes.status }
      );
    }

    const deleteData = await deleteRes.json();

    // If there's a filename, delete from VPS
    if (deleteData.filename) {
      try {
        await fetch(`${API_URL}/upload/vps`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Cookie: request.headers.get("cookie") || "",
          },
          body: JSON.stringify({
            filepath: `basel-pdfs/${deleteData.filename}`,
          }),
        });
      } catch (vpsError) {
        console.error("Error deleting from VPS:", vpsError);
        // Continue even if VPS deletion fails
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting PDF:", error);
    return NextResponse.json(
      { error: "Failed to delete PDF" },
      { status: 500 }
    );
  }
}
