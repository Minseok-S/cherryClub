import { NextResponse } from "next/server";
import { readdir } from "fs/promises";
import path from "path";

export async function GET() {
  const imageDir = path.join(process.cwd(), "public");

  console.log("imageDir", imageDir);

  const files = await readdir(imageDir);
  return NextResponse.json({ images: files });
}
