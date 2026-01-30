import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";

// API Base URL for backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

// Increase body size limit for file uploads (50MB)
export const config = {
  api: {
    bodyParser: false,
  },
};

// Alternative: Use Next.js 13+ route segment config
export const maxDuration = 60; // Allow up to 60 seconds for upload
export const dynamic = "force-dynamic";

// GET /api/basel/pdfs - List PDFs for a chapter (proxy to backend)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const chapterId = searchParams.get("chapterId");

    if (!chapterId) {
      return NextResponse.json(
        { error: "chapterId is required" },
        { status: 400 }
      );
    }

    // Proxy to backend
    const res = await fetch(`${API_URL}/basel/chapters/${chapterId}`, {
      headers: {
        Cookie: request.headers.get("cookie") || "",
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch chapter" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json({ pdfs: data.chapter?.pdfs || [] });
  } catch (error) {
    console.error("Error fetching PDFs:", error);
    return NextResponse.json(
      { error: "Failed to fetch PDFs" },
      { status: 500 }
    );
  }
}

// POST /api/basel/pdfs - Upload PDF to VPS (admin only)
export async function POST(request: Request) {
  try {
    const adminError = await requireAdmin();
    if (adminError) return adminError;

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const name = formData.get("name") as string | null;
    const chapterId = formData.get("chapterId") as string | null;

    if (!file || !name || !chapterId) {
      return NextResponse.json(
        { error: "file, name, and chapterId are required" },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    // Step 1: Upload file to VPS via backend
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("folder", "basel-pdfs");

    const uploadRes = await fetch(`${API_URL}/upload/vps`, {
      method: "POST",
      headers: {
        Cookie: request.headers.get("cookie") || "",
      },
      body: uploadFormData,
    });

    if (!uploadRes.ok) {
      const error = await uploadRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: error.error || "Failed to upload file to VPS" },
        { status: uploadRes.status }
      );
    }

    const uploadData = await uploadRes.json();

    // Step 2: Create PDF record in backend
    const pdfRes = await fetch(`${API_URL}/basel/chapters/pdfs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: request.headers.get("cookie") || "",
      },
      body: JSON.stringify({
        name,
        url: uploadData.url,
        filename: uploadData.filename,
        chapterId,
      }),
    });

    if (!pdfRes.ok) {
      const error = await pdfRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: error.error || "Failed to create PDF record" },
        { status: pdfRes.status }
      );
    }

    const pdf = await pdfRes.json();
    return NextResponse.json(pdf, { status: 201 });
  } catch (error) {
    console.error("Error uploading PDF:", error);
    return NextResponse.json(
      { error: "Failed to upload PDF" },
      { status: 500 }
    );
  }
}
