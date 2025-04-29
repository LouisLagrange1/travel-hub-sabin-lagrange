import type { NextApiRequest, NextApiResponse } from "next";
import Redis from "ioredis";
import mongoose from "mongoose";
import neo4j from "neo4j-driver";

const redis = new Redis(process.env.REDIS_URL!);
const driver = neo4j.driver(
  process.env.NEO4J_URI!,
  neo4j.auth.basic(process.env.NEO4J_USER!, process.env.NEO4J_PASSWORD!)
);

const OfferSchema = new mongoose.Schema({
  /* modèle identique à plus haut */
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
  const { id } = req.query;

  if (!id) {
    return res
      .status(400)
      .json({ error: "L'identifiant de l'offre est requis." });
  }

  const cacheKey = `offers:${id}`;

  try {
    // Vérifie le cache Redis
    const cachedOffer = await redis.get(cacheKey);
    if (cachedOffer) {
      return res.status(200).json(JSON.parse(cachedOffer));
    }

    // Si pas en cache, interroge MongoDB
    await connectMongo();
    const offer = await Offer.findById(id);

    if (!offer) {
      return res.status(404).json({ error: "Offre introuvable." });
    }

    // Recommandations via Neo4j
    const session = driver.session();
    const query = `
      MATCH (c1:City {code:$from})-[:NEAR]->(c2:City)
      RETURN c2.code AS city LIMIT 3
    `;
    const relatedCities = await session.run(query, { from: offer.from });

    offer.relatedOffers = relatedCities.records.map((record) =>
      record.get("city")
    );

    // Stocke dans Redis (TTL 300s)
    await redis.set(cacheKey, JSON.stringify(offer), "EX", 300);

    res.status(200).json(offer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
}
