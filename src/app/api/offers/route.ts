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
    const { title, description, price, city, dateFrom, dateTo } = await req.json();

    console.log(`Requête POST: Création de l'offre ${title}`);

    if (!title || !description || !price || !city || !dateFrom || !dateTo) {
      return NextResponse.json({ error: "Tous les champs sont requis." }, { status: 400 });
    }

    const offer = {
      title,
      description,
      price,
      city,
      dateFrom,
      dateTo,
      createdAt: new Date(),
    };

    console.log("Insertion de l'offre dans MongoDB...");
    const result = await connectMongo.collection("offers").insertOne(offer);
    const offerId = result.insertedId;

    console.log("Offre insérée dans MongoDB avec succès, ID:", offerId);

    const session = driver.session();
    try {
      console.log("Création de la relation dans Neo4j...");
      const query = `
        MATCH (c:City {code:$city})
        CREATE (o:Offer {id:$offerId, title:$title, description:$description, price:$price, dateFrom:$dateFrom, dateTo:$dateTo})
        CREATE (o)-[:IS_IN]->(c)
      `;
      await session.run(query, {
        offerId,
        title,
        description,
        price,
        dateFrom,
        dateTo,
        city,
      });
      console.log("Relation Neo4j créée avec succès.");
    } catch (error) {
      console.error("Erreur Neo4j lors de l'insertion de l'offre:", error);
    } finally {
      await session.close();
    }

    // Publier l'événement de la nouvelle offre dans Redis (Pub/Sub)
    try {
      const message = {
        offerId: offerId.toHexString(),
        from: dateFrom,
        to: dateTo,
      };

      console.log("Publication de l'événement dans Redis...");
      await redis.publish("offers:new", JSON.stringify(message));
      console.log("Événement publié dans Redis.");
    } catch (error) {
      console.error("Erreur lors de la publication Redis:", error);
    }

    // Retourner la nouvelle offre avec son ID
    return NextResponse.json({ id: offerId, ...offer }, { status: 201 });

  } catch (error) {
    console.error("Erreur serveur lors de la création de l'offre:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
