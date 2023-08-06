import { z } from "zod";

export let UsernameValidator = z.object({
  name: z
    .string()
    .min(3)
    .max(40)
    .regex(/^[a-zA-Z0-9]+$/),
});

export type UsernameValidatorRequest = z.infer<typeof UsernameValidator>;
