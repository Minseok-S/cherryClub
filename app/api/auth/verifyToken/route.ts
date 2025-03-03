import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();

    // 토큰 존재 여부 검증
    if (!requestBody?.token) {
      return NextResponse.json(
        { error: "토큰이 제공되지 않았습니다" },
        { status: 400 }
      );
    }

    // JWT_SECRET 환경 변수 검증
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET 환경 변수가 설정되지 않았습니다");
    }

    // 토큰 파싱 및 검증
    let token: string;
    try {
      const tokenObj = JSON.parse(requestBody.token);
      token = tokenObj.token;
    } catch (err) {
      console.error("토큰 파싱 에러:", err);
      return NextResponse.json(
        {
          error: `토큰 파싱에 실패했습니다: ${
            err instanceof Error ? err.message : "알 수 없는 오류"
          }`,
        },
        { status: 400 }
      );
    }

    // 토큰 검증 및 디코딩
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      userName: string;
      authority: number;
      university: string;
      region: string;
      exp: number;
    };

    // 토큰 만료 시간 검증
    if (decoded.exp < Math.floor(Date.now() / 1000)) {
      return NextResponse.json(
        {
          error: "토큰이 만료되었습니다",
          expired: true, // 클라이언트에서 만료 상태를 식별할 수 있도록 추가
        },
        { status: 401 }
      );
    }

    // 유효한 토큰 응답
    return NextResponse.json({
      userName: decoded.userName,
      authority: decoded.authority,
      university: decoded.university,
      region: decoded.region,
    });
  } catch (error) {
    console.error("토큰 검증 실패:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "유효하지 않은 토큰입니다",
      },
      { status: 401 }
    );
  }
}
