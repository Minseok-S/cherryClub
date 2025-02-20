import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  const data = await req.formData();
  const file: File | null = data.get("image") as File;

  if (!file) {
    return NextResponse.json({ success: false });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // public/images 디렉토리에 저장
  const uploadPath = path.join(process.cwd(), "public", file.name);
  await writeFile(uploadPath, buffer);

  return NextResponse.json({ success: true, filename: file.name });
}
