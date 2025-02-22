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
    if (
      !data.name ||
      !data.phone ||
      !data.birthdate ||
      !data.university ||
      !data.major
    ) {
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
        birthdate = ?, 
        university = ?, 
        major = ?, 
        student_id = ?, 
        grade = ?, 
        region = ?, 
        message = ?, 
        agree = ?,
        created_at = NOW()`,
      [
        data.name,
        data.gender,
        data.phone,
        data.birthdate,
        data.university,
        data.major,
        data.studentId,
        data.grade,
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

export async function GET(request: Request) {
  try {
    const connection = await pool.getConnection();
    const { searchParams } = new URL(request.url);

    // URL 파라미터에서 권한 정보 추출
    const authority = searchParams.get("authority");
    const userName = searchParams.get("name");
    const region = searchParams.get("region");

    let query = "SELECT * FROM applications";
    const params = [];

    // 권한에 따른 필터 조건 추가
    if (authority === "1") {
      query += " WHERE region = ?";
      params.push(region);
    } else if (authority === "2") {
      query += " WHERE university = ?";
      params.push(userName);
    }

    query += " ORDER BY created_at DESC";

    const [rows] = await connection.query(query, params);

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

export async function PUT(request: Request) {
  try {
    const connection = await pool.getConnection();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const { status } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: "ID와 상태값이 필요합니다" },
        { status: 400 }
      );
    }

    // 상태 업데이트 쿼리
    await connection.query("UPDATE applications SET status = ? WHERE id = ?", [
      status,
      id,
    ]);

    // 상태가 '참여'로 변경된 경우 clubUsers 테이블에 추가
    if (status === "참여") {
      // 기존 신청서 데이터 조회 (타입 어설션 추가)
      const [rows] = await connection.query(
        "SELECT * FROM applications WHERE id = ?",
        [id]
      );
      const application = (rows as mysql.RowDataPacket[])[0];

      if (application) {
        await connection.query(
          `INSERT INTO clubUsers SET 
            name = ?,
            gender = ?,
            phone = ?,
            birthdate = ?,
            university = ?,
            major = ?,
            student_id = ?,
            grade = ?,
            region = ?,
            message = ?,
            created_at = ?`,
          [
            application.name,
            application.gender,
            application.phone,
            application.birthdate,
            application.university,
            application.major,
            application.student_id,
            application.grade,
            application.region,
            application.message || null,
            application.created_at,
          ]
        );
      }
    }
    // 상태가 '포기'로 변경된 경우 clubUsers 테이블에서 삭제
    else if (status === "포기") {
      const [rows] = await connection.query(
        "SELECT student_id FROM applications WHERE id = ?",
        [id]
      );
      const studentId = (rows as mysql.RowDataPacket[])[0]?.student_id;

      if (studentId) {
        await connection.query("DELETE FROM clubUsers WHERE student_id = ?", [
          studentId,
        ]);
      }
    }

    connection.release();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "서버 내부 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
