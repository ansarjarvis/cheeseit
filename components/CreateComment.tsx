"use client";

import { FC, useState } from "react";
import { Label } from "./ui/Label";
import { Textarea } from "./ui/Textarea";
import { Button } from "./ui/Button";
import { useMutation } from "@tanstack/react-query";
import { CommentRequest } from "@/lib/validators/comment";
import axios, { AxiosError } from "axios";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface CreateCommentProps {
  postId: string;
  replyToId?: string;
}

const CreateComment: FC<CreateCommentProps> = ({ postId, replyToId }) => {
  let { loginToast } = useCustomToast();
  let [input, setInput] = useState<string>("");
  let router = useRouter();

  let { mutate: createComment, isLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
      let payload: CommentRequest = {
        postId,
        text,
        replyToId,
      };

      let { data } = await axios.patch(`/api/subreddit/post/comment`, payload);
      return data;
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
      router.refresh();
      setInput(" ");
    },
  });

  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="comment"> Your Comment</Label>
      <div className="mt-2">
        <Textarea
          placeholder="what are your comments"
          id="comment"
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="mt-2 flex justify-end">
          <Button
            isLoading={isLoading}
            disabled={input.length === 0}
            onClick={() => createComment({ postId, text: input, replyToId })}
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateComment;
