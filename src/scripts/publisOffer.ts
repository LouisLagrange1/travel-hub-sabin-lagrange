import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL!);

export async function publishNewOffer(offer: any) {
  const message = JSON.stringify({
    offerId: offer._id,
    from: offer.from,
    to: offer.to,
  });

  await redis.publish("offers:new", message);
}
