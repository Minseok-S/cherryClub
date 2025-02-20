import { NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const filename = searchParams.get("filename");

  if (!filename) {
    return NextResponse.json({ success: false });
  }

  const filePath = path.join(process.cwd(), "public", filename);
  await unlink(filePath);

  return NextResponse.json({ success: true });
}
