import type { NextApiRequest, NextApiResponse } from "next";
import Redis from "ioredis";
import mongoose from "mongoose";

const redis = new Redis(process.env.REDIS_URL!);

// Modèle MongoDB
const OfferSchema = new mongoose.Schema({
  from: String,
  to: String,
  price: Number,
  provider: String,
  currency: String,
  legs: Array,
});
const Offer = mongoose.models.Offer || mongoose.model("Offer", OfferSchema);

async function connectMongo() {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGO_URI!);
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { from, to, limit = 10 } = req.query;

  if (!from || !to) {
    return res
      .status(400)
      .json({ error: "Les paramètres 'from' et 'to' sont requis." });
  }

  const cacheKey = `offers:${from}:${to}`;

  try {
    // Vérifie le cache Redis
    const cachedOffers = await redis.get(cacheKey);
    if (cachedOffers) {
      return res.status(200).json(JSON.parse(cachedOffers));
    }

    // Si pas en cache, interroge MongoDB
    await connectMongo();
    const offers = await Offer.find({ from, to })
      .sort({ price: 1 })
      .limit(Number(limit));

    // Stocke dans Redis (TTL 60s)
    await redis.set(cacheKey, JSON.stringify(offers), "EX", 60);

    res.status(200).json(offers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
}
