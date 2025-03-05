import { NextResponse } from "next/server";
import { pool } from "../../db";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// 사용자 타입 인터페이스 정의
interface User {
  name: string;
  authority: number;
  university: string;
  region: string;
  password: string;
}

export async function POST(request: Request) {
  let connection;
  try {
    const { phone, password } = await request.json();

    // phone 값 처리: -가 없으면 추가, 있으면 유지
    let cleanedPhone = phone.replace(/-/g, "");
    if (cleanedPhone.length === 11) {
      cleanedPhone = `${cleanedPhone.slice(0, 3)}-${cleanedPhone.slice(
        3,
        7
      )}-${cleanedPhone.slice(7)}`;
    }

    // 입력값 유효성 검사 추가
    if (!cleanedPhone || !password) {
      return NextResponse.json(
        { error: "유효하지 않은 요청 형식입니다" },
        { status: 400 }
      );
    }

    connection = await pool.getConnection();

    // 쿼리 수정: cleanedPhone 사용
    const [rows] = await connection.execute<[]>(
      "SELECT name, authority, university, region, password FROM users WHERE phone = ? LIMIT 1",
      [cleanedPhone]
    );

    const users = rows as User[];

    if (users.length === 0) {
      return NextResponse.json(
        { error: "유효하지 않은 인증 코드입니다" },
        { status: 401 }
      );
    }

    const user = users[0];

    // 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "잘못된 비밀번호입니다" },
        { status: 401 }
      );
    }

    const tokenPayload = {
      userName: user.name,
      authority: user.authority,
      university: user.university,
      region: user.region,
      exp: Math.floor(Date.now() / 1000) + 1800, // 30분 후 만료
    };

    // JWT_SECRET 환경 변수 검증
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET 환경 변수가 설정되지 않았습니다");
    }

    return NextResponse.json(
      {
        success: true,
        userName: user.name,
        authority: user.authority,
        university: user.university,
        region: user.region,
        token: jwt.sign(tokenPayload, process.env.JWT_SECRET),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("인증 오류:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "서버 내부 오류" },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}
