import { randomBytes, createHmac } from "crypto";
import jwt from "jsonwebtoken";

const getSaltAndHashFromString = (userSalt, inputString) => {
  const salt = userSalt ? userSalt : randomBytes(256).toString("hex");

  const hashedKeys = createHmac("sha256", salt)
    .update(inputString)
    .digest("hex");

  return { salt, hashedKeys };
};

const createJwtTokenForUser = (existingUser) => {
  const jwtPayload = {
    id: existingUser.id,
    name: existingUser.name,
    email: existingUser.email,
  };
  const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  return token;
};

export { getSaltAndHashFromString, createJwtTokenForUser };
