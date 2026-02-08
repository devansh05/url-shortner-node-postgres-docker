import { z } from "zod";

const urlValidations = z.object({
  url: z.string(),
});

export { urlValidations };
