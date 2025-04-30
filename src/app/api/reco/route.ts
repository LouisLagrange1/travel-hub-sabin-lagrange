import { NextRequest, NextResponse } from "next/server";
import neo4j from "neo4j-driver";

const driver = neo4j.driver(
  process.env.NEO4J_URI!,
  neo4j.auth.basic(process.env.NEO4J_USER!, process.env.NEO4J_PASSWORD!)
);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city");
  const kRaw = searchParams.get("k") || "3";

  if (!city) {
    return NextResponse.json({ error: "Le paramètre 'city' est requis." }, { status: 400 });
  }

  const k = neo4j.int(parseInt(kRaw, 10));
  const session = driver.session();

  try {
    const query = `
      MATCH (c:City {code: $city})-[:NEAR]->(n:City)
      RETURN n.code AS city ORDER BY n.weight DESC LIMIT $k
    `;
    const result = await session.run(query, { city, k });

    const recommendations = result.records.map((r) => ({
      city: r.get("city"),
    }));

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error("Erreur dans /api/reco:", error);
    return NextResponse.json({ error: "Erreur interne du serveur." }, { status: 500 });
  } finally {
    await session.close();
  }
}
