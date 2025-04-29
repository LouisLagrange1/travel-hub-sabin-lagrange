import type { NextApiRequest, NextApiResponse } from "next";
import Redis from "ioredis";
import { v4 as uuidv4 } from "uuid";

const redis = new Redis(process.env.REDIS_URL!);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée." });
  }

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "Le champ 'userId' est requis." });
  }

  const sessionId = uuidv4();
  await redis.set(`session:${sessionId}`, userId, "EX", 900);

  res.status(200).json({ token: sessionId, expires_in: 900 });
}
