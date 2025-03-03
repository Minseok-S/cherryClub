import { NextResponse } from "next/server";
import { pool } from "../db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";

  // 빈 쿼리 검사 추가
  if (!query.trim()) {
    return NextResponse.json([], { status: 200 });
  }

  try {
    const connection = await pool.getConnection();

    // 인덱스 활용을 위해 LIKE 검색 최적화
    const [rows] = await connection.query(
      `SELECT name, location AS country 
       FROM Universities 
       WHERE name LIKE CONCAT(?, '%')  -- 접두사 검색으로 인덱스 활용
       ORDER BY name ASC 
       LIMIT 20`,
      [query]
    );

    connection.release();

    // 타입 캐스팅
    const universities = rows as Array<{
      name: string;
      country: string;
      latitude?: number;
      longitude?: number;
    }>;

    // 클라이언트에 필요한 필드만 매핑
    const mappedData = universities.map((uni) => ({
      name: uni.name,
      country: uni.country,
    }));

    return NextResponse.json(mappedData);
  } catch (error) {
    console.error("DB 검색 오류:", error);
    return NextResponse.json({ error: "대학교 검색 실패" }, { status: 500 });
  } finally {
  }
}
