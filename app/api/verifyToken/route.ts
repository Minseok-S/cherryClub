import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    console.log("Received request body:", requestBody); // 디버깅용 로그

    // 토큰이 없는 경우
    if (!requestBody.token) {
      console.error("Token is missing in request body");
      return NextResponse.json(
        { error: "토큰이 제공되지 않았습니다" },
        { status: 400 }
      );
    }

    // 토큰 파싱
    let parsedToken;
    try {
      const tokenObj = JSON.parse(requestBody.token);
      parsedToken = tokenObj.token; // 실제 JWT 토큰 추출
      console.log("Parsed token:", parsedToken);
    } catch (parseError) {
      console.error("Token parsing error:", parseError);
      return NextResponse.json(
        { error: "토큰 파싱에 실패했습니다" },
        { status: 400 }
      );
    }

    // 토큰 검증
    const decoded = jwt.verify(parsedToken, process.env.JWT_SECRET!) as {
      userName: string;
      authority: number;
      exp: number;
    };

    // 토큰 만료 확인
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      return NextResponse.json(
        { error: "토큰이 만료되었습니다" },
        { status: 401 }
      );
    }

    // 유효한 토큰
    return NextResponse.json({
      userName: decoded.userName,
      authority: decoded.authority,
    });
  } catch (error) {
    console.error("토큰 검증 실패:", error);
    return NextResponse.json(
      { error: "유효하지 않은 토큰입니다" },
      { status: 401 }
    );
  }
}
