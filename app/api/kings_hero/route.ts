import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { pool } from "../db";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const connection = await pool.getConnection();
    const data = await request.json();

    const requiredFields = [
      "name",
      "phone",
      "birthday",
      "region",
      "university",
      "major",
      "student_id",
      "grade",
      "semester",
    ];
    if (requiredFields.some((field) => !data[field])) {
      return NextResponse.json(
        { error: "필수 항목이 누락되었습니다" },
        { status: 400 }
      );
    }

    // 전화번호 중복 체크
    const [existingUser] = (await connection.query(
      "SELECT id FROM Applications WHERE phone = ?",
      [data.phone]
    )) as [mysql.RowDataPacket[], mysql.FieldPacket[]];

    if ((existingUser as mysql.RowDataPacket[])[0]) {
      return NextResponse.json(
        {
          error: "이미 등록된 전화번호입니다",
          code: "ER_DUP_ENTRY",
          message: `Duplicate entry '${data.phone}' for key 'applications.contact'`,
        },
        { status: 400 }
      );
    }

    // phone 뒷자리 4자리 추출
    const phoneLast4Digits = data.phone.slice(-4);
    const rawPassword = `hero${phoneLast4Digits}!`;
    const password = await bcrypt.hash(rawPassword, 10); // 비밀번호 해싱

    // 쿼리 파라미터 배열 생성
    const queryParams = [
      data.name,
      data.gender,
      data.phone,
      data.birthday,
      data.region,
      data.university,
      data.major,
      data.student_id,
      data.grade,
      data.semester,
      data.enrollment_status || "재학", // 기본값 설정
      data.vision_camp_batch || "미수료",
      data.ministry_status || 0, // 기본값 설정
      data.is_cherry_club_member || 0, // 기본값 설정
      data.group_number || null, // 기본값 설정
      password, // 해싱된 비밀번호 사용
    ];

    const [result] = await connection.query(
      `INSERT INTO users SET 
        name = ?, 
        gender = ?, 
        phone = ?,
        birthday = ?, 
        region = ?,   
        university = ?, 
        major = ?, 
        student_id = ?,
        grade = ?,      
        semester = ?, 
        enrollment_status = ?,
        vision_camp_batch = ?,
        ministry_status = ?,
        is_cherry_club_member = ?,
        group_number = ?,
        password = ?,
        created_at = NOW()`,
      queryParams
    );

    connection.release();
    return NextResponse.json({ success: true, id: result });
  } catch (error: unknown) {
    console.error("Database error:", error);

    // MySQL 에러 타입 가드
    if (error && typeof error === "object" && "code" in error) {
      const mysqlError = error as { code: string; message: string };

      // MySQL 중복 키 에러 처리
      if (mysqlError.code === "ER_DUP_ENTRY") {
        return NextResponse.json(
          {
            error: "이미 등록된 전화번호입니다",
            code: mysqlError.code,
            message: mysqlError.message,
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "서버 내부 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
