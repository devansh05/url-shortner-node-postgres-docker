import db from "../database/index.js";
import { urlTable } from "../database/schema.js";
import { eq } from "drizzle-orm";

export async function deleteUrlFromId(id) {
  const [deletedUrl] = await db
    .delete(urlTable)
    .where(eq(urlTable.id, id))
    .returning({ targetUrl: urlTable.targetUrl });
  console.log(`🟡 LOG - deletedUrl: `, deletedUrl);
  return deletedUrl;
}

export async function getUrl(url) {
  const [existingUrl] = await db
    .select({
      id: urlTable.id,
    })
    .from(urlTable)
    .where(eq(urlTable.targetUrl, url));
  return existingUrl || "";
}

export async function getUrlFromShortCode(shortCode) {
  const [existingUrl] = await db
    .select({
      redirectTo: urlTable.targetUrl,
    })
    .from(urlTable)
    .where(eq(urlTable.shortUrl, shortCode));

  return existingUrl || "";
}

export async function getAllUrls() {
  const allUrls = await db.select({ ...urlTable }).from(urlTable);
  return allUrls;
}

export async function createShortenedUrl(urlObject) {
  const [createdUrl] = await db
    .insert(urlTable)
    .values({ ...urlObject })
    .returning({ id: urlTable.id });

  return createdUrl;
}
