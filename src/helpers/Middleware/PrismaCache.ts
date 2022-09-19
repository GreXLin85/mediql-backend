import { createPrismaRedisCache } from "prisma-redis-middleware";
import redis from "../Connector/Redis";

const cacheMiddleware = createPrismaRedisCache({
  storage: { type: "redis", options: { client: redis, invalidation: { referencesTTL: 300 }, log: console } },
  cacheTime: 300,
  onHit: (key) => {
    console.log("hit", key);
  },
  onMiss: (key) => {
    console.log("miss", key);
  },
  onError: (key) => {
    console.log("error", key);
  },
});

export default cacheMiddleware;