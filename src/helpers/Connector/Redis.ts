import * as dotenv from 'dotenv'
import { join } from "path";
import Redis from "ioredis";
// temp fix for connection issues
dotenv.config({ path: join(__dirname, "/../../.env") });

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT as string),
    password: process.env.REDIS_PASSWORD,
});

export default redis;