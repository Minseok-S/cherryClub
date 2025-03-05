import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { pool } from "../../db";
import jwt from "jsonwebtoken";
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
      data.vision_camp_batch || "미수료",
      data.status || "PENDING",
      data.message,
    ];

    const [result] = await connection.query(
      `INSERT INTO Applications SET 
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
        vision_camp_batch = ?,
        status = ?,  
        message = ?,
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

export async function GET(request: Request) {
  try {
    // Authorization 헤더 확인
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    // JWT 검증
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET 환경 변수가 설정되지 않았습니다");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      authority: number;
      region: string;
      university: string;
    };

    // 권한 검증 추가
    if (
      decoded.authority === undefined ||
      decoded.authority === null ||
      decoded.authority > 7
    ) {
      return NextResponse.json(
        { error: "접근 권한이 없습니다" },
        { status: 403 }
      );
    }

    const connection = await pool.getConnection();
    const { searchParams } = new URL(request.url);

    // 페이징 파라미터
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    // URL 파라미터에서 권한 정보 추출
    const authority = searchParams.get("authority");
    const region = searchParams.get("region");
    const university = searchParams.get("university");

    let query = "SELECT * FROM Applications";
    const params = [];

    if (authority === "3") {
      query += " WHERE region = ?";
      params.push(region);
    } else if (authority === "4") {
      query += " WHERE university = ? AND region = ?";
      params.push(university, region);
    }

    // 페이징 추가
    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [rows] = await connection.query(query, params);

    // 전체 개수 조회 (페이징을 위해)
    let countQuery = "SELECT COUNT(*) as total FROM Applications";
    if (authority === "3") {
      countQuery += " WHERE region = ?";
    } else if (authority === "4") {
      countQuery += " WHERE university = ? AND region = ?";
    }
    const [countResult] = await connection.query(
      countQuery,
      params.slice(0, -2)
    );
    const total = (countResult as mysql.RowDataPacket[])[0].total;

    connection.release();
    return NextResponse.json(
      {
        data: rows,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      {
        headers: {
          "Cache-Control": "public, max-age=60",
        },
      }
    );
  } catch (error) {
    console.error("Database error:", error);
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: "유효하지 않은 토큰입니다" },
        { status: 401 }
      );
    }
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

    // 상태 값 검증 (Set 사용)
    const validStatuses = new Set([
      "PENDING",
      "PROCESSING",
      "APPROVED",
      "REJECTED",
    ]);
    if (!id || !validStatuses.has(status)) {
      return NextResponse.json(
        { error: "유효하지 않은 요청입니다" },
        { status: 400 }
      );
    }

    // 트랜잭션 시작
    await connection.beginTransaction();

    try {
      // 상태 업데이트 쿼리
      await connection.query(
        "UPDATE Applications SET status = ? WHERE id = ?",
        [status, id]
      );

      if (status === "APPROVED") {
        const [rows] = await connection.query(
          "SELECT * FROM Applications WHERE id = ?",
          [id]
        );
        const application = (rows as mysql.RowDataPacket[])[0];

        // phone 뒷자리 4자리 추출 및 비밀번호 생성
        const phoneLast4Digits = application.phone.slice(-4);
        const rawPassword = `cherry${phoneLast4Digits}!`;
        const password = await bcrypt.hash(rawPassword, 10); // 비밀번호 해싱

        if (application) {
          await connection.query(
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
              vision_camp_batch = ?,
              is_cherry_club_member = ?,
              password = ?`,
            [
              application.name,
              application.gender,
              application.phone,
              application.birthday,
              application.region,
              application.university,
              application.major,
              application.student_id,
              application.grade,
              application.semester,
              application.vision_camp_batch,
              1,
              password,
            ]
          );
        }
      } else if (status === "REJECTED") {
        const [rows] = await connection.query(
          "SELECT * FROM Applications WHERE id = ?",
          [id]
        );
        const application = (rows as mysql.RowDataPacket[])[0];

        if (application) {
          const [userRows] = await connection.query(
            "SELECT id FROM users WHERE phone = ?",
            [application.phone]
          );
          const user = (userRows as mysql.RowDataPacket[])[0];

          if (user) {
            await connection.query("DELETE FROM users WHERE id = ?", [user.id]);
          }
        }
      }

      await connection.commit();
      return NextResponse.json({ success: true });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "서버 내부 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
