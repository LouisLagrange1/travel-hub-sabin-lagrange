db = db.getSiblingDB("supdevinci");

db.createCollection("offers");

db.offers.insertMany([
  {
    from: "PAR",
    to: "TYO",
    departDate: new Date("2025-05-01T10:00:00Z"),
    returnDate: new Date("2025-05-15T10:00:00Z"),
    provider: "AirZen",
    price: 750.0,
    currency: "EUR",
    legs: [{ flightNum: "AZ123", dep: "PAR", arr: "TYO", duration: "12h" }],
    hotel: { name: "Tokyo Inn", nights: 10, price: 500 },
    activity: { title: "Visite du Mont Fuji", price: 100 },
  },
  {
    from: "NYC",
    to: "LON",
    departDate: new Date("2025-06-10T15:00:00Z"),
    returnDate: new Date("2025-06-20T20:00:00Z"),
    provider: "SkyFly",
    price: 450.0,
    currency: "USD",
    legs: [{ flightNum: "SF456", dep: "NYC", arr: "LON", duration: "7h" }],
    hotel: { name: "London Suites", nights: 7, price: 700 },
    activity: { title: "Tour de Londres", price: 80 },
  },
]);
