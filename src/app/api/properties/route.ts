import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", "mock-properties.json");
    const data = await fs.readFile(filePath, "utf-8");
    const json = JSON.parse(data);

    return NextResponse.json({ properties: json.properties });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load properties" }, { status: 500 });
  }
}
