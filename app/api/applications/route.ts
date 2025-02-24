import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { pool } from "../db";

export async function POST(request: Request) {
  try {
    const connection = await pool.getConnection();
    const data = await request.json();

    // 필수 필드 검증 (새로운 스키마에 맞게 수정)
    if (
      !data.name ||
      !data.phone || // phone -> phone로 변경
      !data.birthdate ||
      !data.region || // university 대신 region 추가
      !data.university ||
      !data.major ||
      !data.student_id || // studentId -> student_id로 변경
      !data.grade // grade -> year로 변경
    ) {
      return NextResponse.json(
        { error: "필수 항목이 누락되었습니다" },
        { status: 400 }
      );
    }

    // 데이터 삽입 쿼리 수정
    const [result] = await connection.query(
      `INSERT INTO Applications SET 
        name = ?, 
        gender = ?, 
        phone = ?,
        birthdate = ?, 
        region = ?,   
        university = ?, 
        major = ?, 
        student_id = ?,
        grade = ?,       
        is_campus_participant = ?,
        status = ?,  
        message =?,
        created_at = NOW()`,
      [
        data.name,
        data.gender,
        data.phone,
        data.birthdate,
        data.region,
        data.university,
        data.major,
        data.student_id,
        data.grade,
        data.isCampusParticipant || false,
        data.status || "PENDING", // 기본값 설정
        data.message,
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

    let query = "SELECT * FROM Applications";
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

    // 상태 값 검증 수정 (PROCESSING 상태 추가)
    if (
      !id ||
      !["PENDING", "PROCESSING", "APPROVED", "REJECTED"].includes(status)
    ) {
      return NextResponse.json(
        { error: "유효하지 않은 요청입니다" },
        { status: 400 }
      );
    }

    // 상태 업데이트 쿼리
    await connection.query("UPDATE Applications SET status = ? WHERE id = ?", [
      status,
      id,
    ]);

    // APPROVED 상태일 때 User 및 ClubUser 테이블에 추가
    if (status === "APPROVED") {
      const [rows] = await connection.query(
        "SELECT * FROM Applications WHERE id = ?",
        [id]
      );
      const application = (rows as mysql.RowDataPacket[])[0];

      if (application) {
        // User 테이블에 삽입
        const [userResult] = await connection.query(
          `INSERT INTO Users SET 
            name = ?,
            gender = ?,
            phone = ?,
            birthdate = ?,
            region = ?,
            university = ?,
            major = ?,
            student_id = ?,
            grade = ?,
            is_campus_participant = ?`,
          [
            application.name,
            application.gender,
            application.phone,
            application.birthdate,
            application.region,
            application.university,
            application.major,
            application.student_id,
            application.grade,
            application.is_campus_participant,
          ]
        );

        // ClubUser 테이블에 user_id 삽입
        const userId = (userResult as mysql.ResultSetHeader).insertId;
        await connection.query("INSERT INTO ClubUser (user_id) VALUES (?)", [
          userId,
        ]);
      }
    }
    // REJECTED 상태일 때 User 및 ClubUser에서 삭제
    else if (status === "REJECTED") {
      const [rows] = await connection.query(
        "SELECT * FROM Applications WHERE id = ?",
        [id]
      );
      const application = (rows as mysql.RowDataPacket[])[0];

      if (application) {
        // Users 테이블에서 student_id로 사용자 조회
        const [userRows] = await connection.query(
          "SELECT id FROM Users WHERE student_id = ?",
          [application.student_id]
        );
        const user = (userRows as mysql.RowDataPacket[])[0];

        if (user) {
          // ClubUser 테이블에서 삭제
          await connection.query("DELETE FROM ClubUser WHERE user_id = ?", [
            user.id,
          ]);
          // Users 테이블에서 삭제
          await connection.query("DELETE FROM Users WHERE id = ?", [user.id]);
        }
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
