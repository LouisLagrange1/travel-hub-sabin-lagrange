import { NextRequest, NextResponse } from "next/server";
import Redis from "ioredis";
import { connectMongo } from "@/lib/db";
import neo4j from "neo4j-driver";

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

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  console.log(`Requête GET: Recherche des offres de ${from} à ${to} avec une limite de ${limit}`);

  if (!from || !to) {
    return NextResponse.json(
      { error: "Les paramètres 'from' et 'to' sont requis." },
      { status: 400 }
    );
  }

  const cacheKey = `offers:${from}:${to}`;

  try {
    let cachedData;
    console.log("Tentative de récupération des données du cache Redis...");
    try {
      cachedData = await redis.get(cacheKey);
      console.log("Données cache Redis récupérées:", cachedData);
    } catch (redisError) {
      console.error('Erreur Redis:', redisError);
    }

    if (cachedData) {
      console.log("Données trouvées dans le cache, retour des données...");
      return NextResponse.json(JSON.parse(cachedData));
    }

    console.log("Données non trouvées dans le cache, récupération depuis MongoDB...");
    const offers = await connectMongo.collection("offers").find({ from, to })
      .sort({ price: 1 })
      .limit(limit)
      .toArray();
    console.log("Offres récupérées depuis MongoDB:", offers);

    console.log("Tentative de mise en cache des données dans Redis...");
    try {
      await redis.set(cacheKey, JSON.stringify(offers), 'EX', 60);
      console.log("Offres mises en cache dans Redis avec succès.");
    } catch (redisError) {
      console.error('Échec mise en cache:', redisError);
    }

    return NextResponse.json(offers);

  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const {
      from,
      to,
      departDate,
      returnDate,
      provider,
      price,
      currency,
      legs,
      hotel,
      activity,
    } = await req.json();

    if (!from || !to || !departDate || !returnDate || !provider || !price || !currency) {
      return NextResponse.json(
        { error: "Tous les champs sont requis." },
        { status: 400 }
      );
    }

    const offer = {
      from,
      to,
      departDate: new Date(departDate),
      returnDate: new Date(returnDate),
      provider,
      price,
      currency,
      legs,
      hotel,
      activity,
      createdAt: new Date(),
    };

    const db = await connectMongo;
    const result = await db.collection("offers").insertOne(offer);
    const offerId = result.insertedId;

    // Neo4j
    const session = driver.session();
    try {
      await session.run(
        `MATCH (from:City {code:$from}), (to:City {code:$to})
         CREATE (o:Offer {
           id:$offerId, provider:$provider, price:$price, currency:$currency,
           departDate:$departDate, returnDate:$returnDate
         })
         CREATE (o)-[:FLIES_FROM]->(from)
         CREATE (o)-[:FLIES_TO]->(to)`,
        {
          offerId: offerId.toString(),
          from,
          to,
          provider,
          price,
          currency,
          departDate,
          returnDate,
        }
      );
    } catch (e) {
      console.error("Erreur Neo4j:", e);
    } finally {
      await session.close();
    }

    // Redis pub/sub
    try {
      await redis.publish(
        "offers:new",
        JSON.stringify({
          offerId: offerId.toHexString(),
          from,
          to,
          departDate,
          returnDate,
        })
      );
    } catch (e) {
      console.error("Erreur Redis:", e);
    }

    return NextResponse.json({ id: offerId, ...offer }, { status: 201 });
  } catch (error) {
    console.error("Erreur serveur:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
