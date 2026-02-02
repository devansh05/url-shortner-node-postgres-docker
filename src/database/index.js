require("dotenv").config();
const { drizzle } = require("drizzle-orm/node-postgres");
const db = drizzle(process.env.POSTGRES_URL);
export default db;