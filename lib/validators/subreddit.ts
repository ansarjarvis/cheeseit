import { z } from "zod";

export let SubredditSchemaValidator = z.object({
  name: z.string().min(3).max(21),
});

export let SubredditSubscriptionSchemaValidator = z.object({
  subredditId: z.string(),
});

export type CreateSubredditPayload = z.infer<typeof SubredditSchemaValidator>;
export type SubscribeToSubredditPayload = z.infer<
  typeof SubredditSubscriptionSchemaValidator
>;
