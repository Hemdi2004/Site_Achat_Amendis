import "dotenv/config";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../generated/prisma/client.js";

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined. Add it to your .env file.");
}

const adapter = new PrismaNeon({ connectionString });

export const prisma = new PrismaClient({
  adapter,
});

export default prisma;