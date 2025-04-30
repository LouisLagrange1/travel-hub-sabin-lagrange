// src/app/api/auth/login/route.ts

import { NextRequest, NextResponse } from "next/server";
import Redis from "ioredis";
import { v4 as uuidv4 } from "uuid";

const redis = new Redis(process.env.REDIS_URL!);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId } = body;

  if (!userId) {
    return NextResponse.json({ error: "Le champ 'userId' est requis." }, { status: 400 });
  }

  const sessionId = uuidv4();
  await redis.set(`session:${sessionId}`, userId, "EX", 900);

  return NextResponse.json({ token: sessionId, expires_in: 900 });
}
