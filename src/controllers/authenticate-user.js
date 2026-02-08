import dotenv from "dotenv";
dotenv.config();
import { getUserByEmail, createUserFromObject } from "../services/index.js";
import {
  getSaltAndHashFromString,
  createJwtTokenForUser,
} from "../utilities/utilities.js";
import { signUpValidations, loginValidations } from "../validations/index.js";

const signUpUser = async (req, res) => {
  const validatedRequest = await signUpValidations.safeParseAsync(req.body);

  if (validatedRequest.error) {
    throw new Error(validatedRequest.error);
  }
  const { name, email, password } = validatedRequest.data;
  try {
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      throw new Error({
        error: "User with this email already present. Please login.",
      });
    }

    const { salt, hashedKeys } = getSaltAndHashFromString("", password);

    const userAdded = createUserFromObject({
      salt,
      name,
      email,
      password: hashedKeys,
    });

    const jwtToken = await createJwtTokenForUser(userAdded);

    return res.json({
      message: `Signed up user successfully.`,
      userId: userAdded.id,
      token: jwtToken,
    });
  } catch (err) {
    throw new Error({
      error: "SERVER ERROR: ",
      err,
    });
  }
};

const loginUser = async (req, res) => {
  const validatedRequest = await loginValidations.safeParseAsync(req.body);

  if (validatedRequest.error) {
    throw new Error(validatedRequest.error);
  }

  const { email, password } = validatedRequest.data;
  try {
    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      return res
        .status(400)
        .json({ error: "Unable to find user with this email. Please signup." });
    }

    const { salt, hashedKeys } = getSaltAndHashFromString(
      existingUser.salt,
      password,
    );

    if (hashedKeys !== existingUser.password || email !== existingUser.email) {
      throw new Error([{ error: "incorrect username or password" }]);
    }
    const jwtToken = createJwtTokenForUser(existingUser);

    req.user = existingUser;

    return res.json({
      message: `Logged in user successfully.`,
      userId: existingUser.id,
      token: jwtToken,
    });
  } catch (err) {
    return res.status(400).send("SERVER ERROR: ", err);
  }
};

export { signUpUser, loginUser };
