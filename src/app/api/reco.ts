import type { NextApiRequest, NextApiResponse } from "next";
import neo4j from "neo4j-driver";

const driver = neo4j.driver(
  process.env.NEO4J_URI!,
  neo4j.auth.basic(process.env.NEO4J_USER!, process.env.NEO4J_PASSWORD!)
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { city, k = 3 } = req.query;

  if (!city) {
    return res.status(400).json({ error: "Le paramètre 'city' est requis." });
  }

  const session = driver.session();

  try {
    const query = `
      MATCH (c:City {code:$city})-[:NEAR]->(n:City)
      RETURN n.code AS city ORDER BY n.weight DESC LIMIT $k
    `;
    const result = await session.run(query, { city, k: Number(k) });

    const recommendations = result.records.map((record) => ({
      city: record.get("city"),
    }));

    res.status(200).json(recommendations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  } finally {
    await session.close();
  }
}
