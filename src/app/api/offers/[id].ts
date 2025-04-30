import { NextRequest, NextResponse } from "next/server";
import Redis from "ioredis";
import { connectMongo } from "@/lib/db";
import neo4j from "neo4j-driver";
import { ObjectId } from "mongodb";

const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => Math.min(times * 100, 3000)
});

const driver = neo4j.driver(
  process.env.NEO4J_URI!,
  neo4j.auth.basic(process.env.NEO4J_USER!, process.env.NEO4J_PASSWORD!)
);

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  console.log(`Requête GET pour l'offre ID: ${id}`);

  if (!ObjectId.isValid(id)) {
    return NextResponse.json(
      { error: "ID d'offre invalide" },
      { status: 400 }
    );
  }

  const cacheKey = `offer:${id}`;

  try {
    // Tentative de récupération depuis le cache
    let cachedOffer;
    try {
      cachedOffer = await redis.get(cacheKey);
      if (cachedOffer) {
        console.log("Offre trouvée dans le cache");
        return NextResponse.json(JSON.parse(cachedOffer));
      }
    } catch (redisError) {
      console.error('Erreur Redis:', redisError);
    }

    // Récupération depuis MongoDB
    console.log("Recherche de l'offre dans MongoDB...");
    const offer = await connectMongo.collection("offers").findOne({ 
      _id: new ObjectId(id) 
    });

    if (!offer) {
      return NextResponse.json(
        { error: "Offre introuvable" },
        { status: 404 }
      );
    }

    // Formatage des données
    const formattedOffer = {
      ...offer,
      _id: offer._id.toString(),
      departDate: offer.departDate?.toISOString(),
      returnDate: offer.returnDate?.toISOString(),
      from: offer.from, // Ensure 'from' is included
      relatedOffers: [] as string[] 
    };

    console.log("Recherche des villes associées dans Neo4j...");
    const session = driver.session();
    try {
      const result = await session.run(
        `MATCH (c:City {code: $from})-[:NEAR]->(related:City)
         RETURN related.code as code LIMIT 5`,
        { from: formattedOffer.from }
      );
      
      formattedOffer.relatedOffers = result.records.map(record => record.get('code'));
    } finally {
      await session.close();
    }

    try {
      await redis.set(cacheKey, JSON.stringify(formattedOffer), 'EX', 300); // 5 minutes
    } catch (redisError) {
      console.error('Erreur de mise en cache:', redisError);
    }

    return NextResponse.json(formattedOffer);

  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
