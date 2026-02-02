require("dotenv").config();
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./src/drizzle",
  schema: "./src/database/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL,
  },
});