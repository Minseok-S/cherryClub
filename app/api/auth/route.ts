import { NextResponse } from "next/server";
import { pool } from "../db";
import jwt from "jsonwebtoken";

// 사용자 타입 인터페이스 정의
interface User {
  name: string;
  authority: number;
  birthdate: string;
  university: string;
  region: string;
}

export async function POST(request: Request) {
  let connection;
  try {
    const { code } = await request.json();
    // MySQL 연결
    connection = await pool.getConnection();
    // SQL 인젝션 방지를 위한 prepared statement
    const [rows] = await connection.execute<[]>(
      "SELECT name, authority FROM users WHERE password = ?",
      [code]
    );

    const users = rows as User[];

    if (users.length === 0) {
      return NextResponse.json(
        { error: "유효하지 않은 인증 코드입니다" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        userName: users[0].name,
        authority: users[0].authority,
        token: jwt.sign(
          {
            userName: users[0].name,
            authority: users[0].authority,
            exp: Math.floor(Date.now() / 1000) + 1800, // 30분 후 만료
          },
          process.env.JWT_SECRET!
        ),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("인증 오류:", error);
    return NextResponse.json({ error: "서버 내부 오류" }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
