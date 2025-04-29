CREATE (par:City {code: "PAR", name: "Paris", country: "FR"});
CREATE (tyo:City {code: "TYO", name: "Tokyo", country: "JP"});
CREATE (nyc:City {code: "NYC", name: "New York", country: "US"});
CREATE (lon:City {code: "LON", name: "London", country: "UK"});

MATCH (par:City {code: "PAR"}), (tyo:City {code: "TYO"})
CREATE (par)-[:NEAR {weight: 0.9}]->(tyo);

MATCH (par:City {code: "PAR"}), (nyc:City {code: "NYC"})
CREATE (par)-[:NEAR {weight: 0.8}]->(nyc);

MATCH (nyc:City {code: "NYC"}), (lon:City {code: "LON"})
CREATE (nyc)-[:NEAR {weight: 0.7}]->(lon);
