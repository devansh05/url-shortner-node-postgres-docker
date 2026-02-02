import dotenv from "dotenv";
dotenv.config();
import { eq } from "drizzle-orm";
import db from "../database/index.js";
import { usersTable } from "../database/schema.js";
import {
  getSaltAndHashFromString,
  createJwtTokenForUser,
} from "../utilities/utilities.js";
import { signUpValidations } from "../validations/index.js";

const signUpUser = async (req, res) => {
  const validatedRequest = await signUpValidations.safeParseAsync(req.body);

  if (validatedRequest.error) {
    throw new Error(validatedRequest.error);
  }

  const { name, email, password } = req.body;
  try {
    const [existingUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already present. Please login." });
    }

    const { salt, hashedKeys } = getSaltAndHashFromString("", password);

    const [userAdded] = await db
      .insert(usersTable)
      .values({
        name,
        email,
        password: hashedKeys,
        salt,
      })
      .returning({ id: usersTable.id });

    const jwtToken = createJwtTokenForUser(userAdded);

    return res.json({
      message: `Signed up user successfully.`,
      userId: userAdded.id,
      token: jwtToken,
    });
  } catch (err) {
    console.error(`🔴🔴🔴 LOG - : ERROR`, err);
    return res.status(400).send("SERVER ERROR: ", err);
  }
};

export { signUpUser };
