import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { PostVoteValidator } from "@/lib/validators/vote";
import type { CachedPost } from "@/types/redis";
import { z } from "zod";

let CACHE_AFTER_UPVOTES = 1;

export let PATCH = async (req: Request) => {
  try {
    let body = await req.json();
    let { postId, voteType } = PostVoteValidator.parse(body);

    let session = await getAuthSession();
    if (!session?.user) {
      return new Response("Unauthorize", { status: 401 });
    }

    let existingVote = await db.vote.findFirst({
      where: {
        userId: session.user.id,
        postId,
      },
    });

    let post = await db.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: true,
        votes: true,
      },
    });

    if (!post) {
      return new Response("Post not found", { status: 404 });
    }

    if (existingVote) {
      if (existingVote.type === voteType) {
        await db.vote.delete({
          where: {
            userId_postId: {
              postId,
              userId: session.user.id,
            },
          },
        });
        return new Response("okey");
      }

      await db.vote.update({
        where: {
          userId_postId: {
            postId,
            userId: session.user.id,
          },
        },
        data: {
          type: voteType,
        },
      });

      /*  recount the vote */

      let votesAmount = post.votes.reduce((acc, vote) => {
        if (vote.type === "UP") return acc + 1;
        if (vote.type === "DOWN") return acc - 1;
        return acc;
      }, 0);

      if (votesAmount >= CACHE_AFTER_UPVOTES) {
        let cachePayload: CachedPost = {
          authorUsername: post.author.username ?? " ",
          content: JSON.stringify(post.content),
          id: post.id,
          title: post.title,
          currentVote: voteType,
          createdAt: post.createAt,
        };

        await redis.hset(`post:${postId}`, cachePayload);
      }
      return new Response("okey");
    }
    await db.vote.create({
      data: {
        type: voteType,
        userId: session.user.id,
        postId,
      },
    });

    let votesAmount = post.votes.reduce((acc, vote) => {
      if (vote.type === "UP") return acc + 1;
      if (vote.type === "DOWN") return acc - 1;
      return acc;
    }, 0);

    if (votesAmount >= CACHE_AFTER_UPVOTES) {
      let cachePayload: CachedPost = {
        authorUsername: post.author.username ?? " ",
        content: JSON.stringify(post.content),
        id: post.id,
        title: post.title,
        currentVote: voteType,
        createdAt: post.createAt,
      };
      await redis.hset(`post:${postId}`, cachePayload);
    }

    return new Response("okey");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }
    return new Response(
      "Could not register your vote right now , try again later",
      {
        status: 500,
      }
    );
  }
};
