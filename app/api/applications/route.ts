import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// MySQL 연결 풀 생성
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function POST(request: Request) {
  try {
    const connection = await pool.getConnection();
    const data = await request.json();

    // 필수 필드 검증
    if (!data.name || !data.phone || !data.university) {
      return NextResponse.json(
        { error: "필수 항목이 누락되었습니다" },
        { status: 400 }
      );
    }

    // 데이터 삽입
    const [result] = await connection.query(
      `INSERT INTO applications SET 
        name = ?, 
        gender = ?, 
        phone = ?, 
        university = ?, 
        student_id = ?, 
        grade = ?, 
        semester = ?, 
        region = ?, 
        message = ?, 
        agree = ?,
        created_at = NOW()`,
      [
        data.name,
        data.gender,
        data.phone,
        data.university,
        data.studentId,
        data.grade,
        data.semester,
        data.region,
        data.message,
        data.agree,
      ]
    );

    connection.release();
    return NextResponse.json({ success: true, id: result });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "서버 내부 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const connection = await pool.getConnection();

    // 실제 구현시 더 강력한 인증 방식 권장

    // 신청 내역 조회
    const [rows] = await connection.query(`
      SELECT * FROM applications 
      ORDER BY created_at DESC
    `);

    connection.release();
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "서버 내부 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
