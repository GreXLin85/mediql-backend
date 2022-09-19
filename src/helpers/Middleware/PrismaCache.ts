import { createPrismaRedisCache } from "prisma-redis-middleware";
import redis from "../Connector/Redis";

const cacheMiddleware = createPrismaRedisCache({
  storage: { type: "redis", options: { client: redis, invalidation: { referencesTTL: 300 } } },
  cacheTime: 300,
  onError: (key) => {
    console.log("error", key);
  },
});

export default cacheMiddleware;