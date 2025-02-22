import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// DB 연결 풀 생성
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";

  try {
    const connection = await pool.getConnection();

    // SQL 인젝션 방지를 위해 파라미터화된 쿼리 사용
    const [rows] = await connection.query(
      `SELECT name, location AS country, latitude, longitude 
       FROM universities 
       WHERE name LIKE ? 
       ORDER BY name ASC 
       LIMIT 20`,
      [`%${query}%`]
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
