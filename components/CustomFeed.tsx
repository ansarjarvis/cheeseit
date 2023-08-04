import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { db } from "@/lib/db";
import PostFeed from "./PostFeed";
import { getAuthSession } from "@/lib/auth";
import { notFound } from "next/navigation";

const CustomFeed = async () => {
  let session = await getAuthSession();
  if (!session) return notFound();

  const followedCommunities = await db.subscription.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      subreddit: true,
    },
  });

  let posts = await db.post.findMany({
    where: {
      subreddit: {
        name: {
          in: followedCommunities.map((sub) => sub.subreddit.name),
        },
      },
    },
    orderBy: {
      createAt: "desc",
    },
    include: {
      votes: true,
      author: true,
      comments: true,
      subreddit: true,
    },
    take: INFINITE_SCROLLING_PAGINATION_RESULTS,
  });

  return <PostFeed initialPosts={posts} />;
};

export default CustomFeed;
