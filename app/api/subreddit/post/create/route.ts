import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PostSchemaValidator } from "@/lib/validators/post";
import { SubredditSubscriptionSchemaValidator } from "@/lib/validators/subreddit";
import { z } from "zod";

export let POST = async (req: Request) => {
  try {
    let session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    let body = await req.json();

    let { subredditId, title, content } = PostSchemaValidator.parse(body);

    let subscriptionExists = await db.subscription.findFirst({
      where: {
        subredditId,
        userId: session.user.id,
      },
    });

    if (!subscriptionExists) {
      return new Response("subscribe to post", {
        status: 400,
      });
    }

    await db.post.create({
      data: {
        title,
        content,
        authorId: session.user.id,
        subredditId,
      },
    });

    return new Response(subredditId);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }
    return new Response("Could not post to subreddit , try again later", {
      status: 500,
    });
  }
};
