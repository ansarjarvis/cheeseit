"use client";

import { FC, startTransition } from "react";
import { Button } from "./ui/Button";
import { useMutation } from "@tanstack/react-query";
import { SubscribeToSubredditPayload } from "@/lib/validators/subreddit";
import axios, { AxiosError } from "axios";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface SubscribeLeaveToggelProps {
  subredditId: string;
  subredditName: string;
  isSubscribe: boolean;
}

const SubscribeLeaveToggel: FC<SubscribeLeaveToggelProps> = ({
  subredditId,
  subredditName,
  isSubscribe,
}) => {
  let { loginToast } = useCustomToast();
  let router = useRouter();

  /*  mutating ( updating / creating ) data */

  let { mutate: subscribe, isLoading: isSubLoading } = useMutation({
    mutationFn: async () => {
      let payload: SubscribeToSubredditPayload = {
        subredditId,
      };

      let { data } = await axios.post("/api/subreddit/subscribe", payload);
      return data as string;
    },

    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return loginToast();
        }
      }

      return toast({
        title: "Their was a problem",
        description: "Something went wrong , try again later",
        variant: "destructive",
      });
    },

    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      return toast({
        title: "Subscribed",
        description: `You are now subscribe to r/${subredditName}`,
        variant: "default",
      });
    },
  });

  let { mutate: unsubscribe, isLoading: isUnSubLoading } = useMutation({
    mutationFn: async () => {
      let payload: SubscribeToSubredditPayload = {
        subredditId,
      };

      let { data } = await axios.post("/api/subreddit/unsubscribe", payload);
      return data as string;
    },

    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return loginToast();
        }
      }

      return toast({
        title: "Their was a problem",
        description: "Something went wrong , try again later",
        variant: "destructive",
      });
    },

    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      return toast({
        title: "Unsubscribed",
        description: `You are now Unsubscribe from r/${subredditName}`,
        variant: "default",
      });
    },
  });

  return isSubscribe ? (
    <Button
      isLoading={isUnSubLoading}
      onClick={() => unsubscribe()}
      className="w-full mb-4 mt-1"
    >
      Leave Community{" "}
    </Button>
  ) : (
    <Button
      isLoading={isSubLoading}
      onClick={() => subscribe()}
      className="w-full mb-4 mt-1"
    >
      {" "}
      Join To Post
    </Button>
  );
};

export default SubscribeLeaveToggel;
