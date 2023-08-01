import { z } from "zod";

export let PostSchemaValidator = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be longer than 3 charactors" })
    .max(130, { message: "Title must be atmost 128 charactors" }),

  subredditId: z.string(),
  content: z.any(),
});

export type PostCreationRequest = z.infer<typeof PostSchemaValidator>;
