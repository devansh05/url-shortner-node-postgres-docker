import { z } from "zod";

const signUpValidations = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(2),
});

const loginValidations = z.object({
  email: z.string().email(),
  password: z.string().min(2),
});

export { signUpValidations, loginValidations };
