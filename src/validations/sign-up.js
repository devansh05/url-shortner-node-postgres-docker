import { z } from "zod";

const signUpValidations = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(2),
});

export { signUpValidations };
