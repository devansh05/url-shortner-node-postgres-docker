import db from "../database/index.js";
import { usersTable } from "../database/schema.js";
import { eq } from "drizzle-orm";

export async function getUserByEmail(email) {
  const [existingUser] = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      salt: usersTable.salt,
      password: usersTable.password,
    })
    .from(usersTable)
    .where(eq(usersTable.email, email));

  return existingUser;
}

export async function createUserFromObject(userObj) {
  const { salt, password, name, email } = userObj;
  const [userAdded] = await db
    .insert(usersTable)
    .values({
      name,
      email,
      password,
      salt,
    })
    .returning({ id: usersTable.id });

  return userAdded;
}
