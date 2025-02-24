import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";
import { pool } from "../db";

interface ClubUser extends RowDataPacket {
  id: number;
  name: string;
  gender: string;
  phone: string;
  university: string;
  major: string;
  is_campus_participant: boolean;
  created_at: string;
  status: string;
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
      SELECT 
        U.id, U.name, U.gender, U.phone, 
        U.university, U.major, U.is_campus_participant,
        U.created_at, C.status
      FROM Users U
      JOIN ClubUser C ON U.id = C.user_id
      ORDER BY U.created_at DESC
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
