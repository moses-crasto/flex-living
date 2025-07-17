import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export async function GET() {
  try {

    // simulate fetch
    await new Promise((r) => setTimeout(r, 500));

    // Read mock data from public folder
    const filePath = path.join(process.cwd(), "public", "mock-reviews.json");
    const data = await fs.readFile(filePath, "utf-8");
    const json = JSON.parse(data);

    // Normalize reviews
    const normalized = json.result.map((review: any) => ({
      id: review.id,
      type: review.type,
      status: review.status,
      rating: review.rating,
      publicReview: review.publicReview,
      submittedAt: review.submittedAt,
      guestName: review.guestName,
      listingName: review.listingName,
      propertyId: review.propertyId,
      approved: review.approved,
      categories: review.reviewCategory.reduce(
        (acc: Record<string, number>, curr: any) => {
          acc[curr.category] = curr.rating;
          return acc;
        },
        {}
      )
    }));


    return NextResponse.json({ reviews: normalized });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load reviews" }, { status: 500 });
  }
}
