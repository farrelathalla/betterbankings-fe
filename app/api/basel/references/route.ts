import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cache } from "@/lib/cache";

// GET /api/basel/references - Get all standards with chapters, sections, and subsections for reference picker
export async function GET() {
  try {
    // Check cache first (5 min TTL)
    const cacheKey = "basel:references";
    const cached = cache.get(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        headers: { "X-Cache": "HIT" },
      });
    }

    const standards = await prisma.baselStandard.findMany({
      orderBy: { order: "asc" },
      select: {
        id: true,
        code: true,
        name: true,
        chapters: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            code: true,
            title: true,
            sections: {
              orderBy: { order: "asc" },
              select: {
                id: true,
                title: true,
                subsections: {
                  orderBy: { order: "asc" },
                  select: {
                    id: true,
                    number: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const response = { standards };
    cache.set(cacheKey, response, 5 * 60); // 5 min cache

    return NextResponse.json(response, {
      headers: { "X-Cache": "MISS" },
    });
  } catch (error) {
    console.error("Error fetching references:", error);
    return NextResponse.json(
      { error: "Failed to fetch references" },
      { status: 500 }
    );
  }
}
