import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";
import { pool } from "../db";

interface ClubUser extends RowDataPacket {
  id: number;
  name: string;
  gender: string;
  phone: string;
  university: string;
  student_id: string;
  grade: string;
  major: string;
  birthday: string;
  vision_camp_batch: string;
  is_cherry_club_member: boolean;
  authority: string;
  created_at: string;
}

export async function GET(request: Request) {
  let connection;
  try {
    // 인증 헤더 확인
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    connection = await pool.getConnection();

    // 클럽 유저 데이터 조회
    const [clubUsers] = await connection.query<ClubUser[]>(`
      SELECT * FROM users
      ORDER BY users.created_at DESC
    `);

    return NextResponse.json(clubUsers, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error fetching club users:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  } finally {
    if (connection) connection.release();
  }
}

export async function POST(request: Request) {
  let connection;
  try {
    const { id, status } = await request.json();

    // 인증 헤더 확인
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    connection = await pool.getConnection();

    // 상태 업데이트 쿼리
    await connection.query(
      `
      UPDATE ClubUser 
      SET status = ? 
      WHERE user_id = ?
    `,
      [status, id]
    );

    return new NextResponse(
      JSON.stringify({ message: "상태가 업데이트되었습니다." }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error updating club user status:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  } finally {
    if (connection) connection.release();
  }
}
