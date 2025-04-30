import { NextRequest, NextResponse } from "next/server";
import Redis from "ioredis";
import { connectMongo } from "@/lib/db";
import neo4j from "neo4j-driver";
import { ObjectId } from "mongodb";
import { Params } from "next/dist/server/request/params";

const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => Math.min(times * 100, 3000),
});

const driver = neo4j.driver(
  process.env.NEO4J_URI!,
  neo4j.auth.basic(process.env.NEO4J_USER!, process.env.NEO4J_PASSWORD!)
);

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const resolvedParams = await params;
  console.log("Paramètres résolus:", resolvedParams);

  if (!resolvedParams.id || resolvedParams.id.length !== 24) {
    return NextResponse.json(
      { error: "Missing id parameter" },
      { status: 400 }
    );
  }

  const id = resolvedParams.id;

  console.log(`Requête GET pour l'offre ID: ${id}`);

  const idString = Array.isArray(id) ? id[0] : id;
  if (!idString || idString.length !== 24 || !ObjectId.isValid(idString)) {
    return NextResponse.json({ error: "ID d'offre invalide" }, { status: 400 });
  }

  const cacheKey = `offer:${id}`;

  try {
    let cachedOffer;
    try {
      cachedOffer = await redis.get(cacheKey);
      if (cachedOffer) {
        console.log("Offre trouvée dans le cache");
        return NextResponse.json(JSON.parse(cachedOffer));
      }
    } catch (redisError) {
      console.error("Erreur Redis:", redisError);
    }

    console.log("Recherche de l'offre dans MongoDB...");
    const offer = await connectMongo.collection("offers").findOne({
      _id: new ObjectId(Array.isArray(id) ? id[0] : id), // Transformation de l'ID en ObjectId
    });

    if (!offer) {
      console.log(`Aucune offre trouvée avec l'ID: ${id}`);
      return NextResponse.json({ error: "Offre introuvable" }, { status: 404 });
    }

    const formattedOffer = {
      ...offer,
      _id: offer._id.toString(),
      departDate: offer.departDate?.toISOString(),
      returnDate: offer.returnDate?.toISOString(),
      from: offer.from,
      relatedOffers: [] as string[],
    };

    console.log("Recherche des villes associées dans Neo4j...");
    const session = driver.session();
    try {
      const result = await session.run(
        `MATCH (c:City {code: $from})-[:NEAR]->(related:City)
         RETURN related.code as code LIMIT 5`,
        { from: formattedOffer.from }
      );

      formattedOffer.relatedOffers = result.records.map((record) =>
        record.get("code")
      );
    } finally {
      await session.close();
    }

    try {
      await redis.set(cacheKey, JSON.stringify(formattedOffer), "EX", 300);
      console.log("Offre mise en cache avec succès");
    } catch (redisError) {
      console.error("Erreur de mise en cache:", redisError);
    }

    return NextResponse.json(formattedOffer);
  } catch (error) {
    console.error("Erreur serveur:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
