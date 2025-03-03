import { NextResponse } from "next/server";
import { pool } from "../../db";
import jwt from "jsonwebtoken";

// 사용자 타입 인터페이스 정의
interface User {
  name: string;
  authority: number;
  university: string;
  region: string;
}

export async function POST(request: Request) {
  let connection;
  try {
    const { code } = await request.json();
    connection = await pool.getConnection();
    const [rows] = await connection.execute<[]>(
      "SELECT name, authority, university, region FROM users WHERE password = ?",
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
        university: users[0].university,
        region: users[0].region,
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
