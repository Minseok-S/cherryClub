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

// 사용자 타입 인터페이스 정의
interface User {
  name: string;
  authority: number;
  authCode: string;
}

export async function POST(request: Request) {
  let connection;
  try {
    const { code } = await request.json();

    // MySQL 연결
    connection = await pool.getConnection();

    // SQL 인젝션 방지를 위한 prepared statement
    const [rows] = await connection.execute<[]>(
      "SELECT name, authority, authCode FROM user WHERE authCode = ?",
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
      { success: true, userName: users[0].name, authority: users[0].authority },
      { status: 200 }
    );
  } catch (error) {
    console.error("인증 오류:", error);
    return NextResponse.json({ error: "서버 내부 오류" }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
