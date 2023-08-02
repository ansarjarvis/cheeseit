"use client";

import { FC, useCallback, useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useForm } from "react-hook-form";
import {
  PostCreationRequest,
  PostSchemaValidator,
} from "@/lib/validators/post";
import { zodResolver } from "@hookform/resolvers/zod";
import type EditorJS from "@editorjs/editorjs";
import { uploadFiles } from "@/lib/uploadthing";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

type FormData = z.infer<typeof PostSchemaValidator>;

interface EditorProps {
  subredditId: string;
}

const Editor: FC<EditorProps> = ({ subredditId }) => {
  let {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(PostSchemaValidator),
    defaultValues: {
      subredditId,
      title: "",
      content: null,
    },
  });

  let editorRef = useRef<EditorJS>();
  let _titleRef = useRef<HTMLTextAreaElement>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  let pathname = usePathname();
  let router = useRouter();

  let { mutate: createPost } = useMutation({
    mutationFn: async ({
      title,
      content,
      subredditId,
    }: PostCreationRequest) => {
      let payload: PostCreationRequest = {
        title,
        content,
        subredditId,
      };
      let { data } = await axios.post("/api/subreddit/post/create", payload);
      return data;
    },

    onError: () => {
      return toast({
        title: "Something went wrong",
        description: "your post was not published please try again later",
        variant: "destructive",
      });
    },

    onSuccess: () => {
      let newPathname = pathname.split("/").slice(0, -1).join("/");
      router.push(newPathname);
      router.refresh();
    },
  });

  let initializeEditor = useCallback(async () => {
    let EditorJS = (await import("@editorjs/editorjs")).default;
    let Header = (await import("@editorjs/header")).default;
    let Embed = (await import("@editorjs/embed")).default;
    let Table = (await import("@editorjs/table")).default;
    let List = (await import("@editorjs/list")).default;
    let Code = (await import("@editorjs/code")).default;
    let LinkTool = (await import("@editorjs/link")).default;
    let InlineCode = (await import("@editorjs/inline-code")).default;
    let ImageTool = (await import("@editorjs/image")).default;

    if (!editorRef.current) {
      let editor = new EditorJS({
        holder: "editor",
        onReady() {
          editorRef.current = editor;
        },
        placeholder: "Type here to write to your post...",
        inlineToolbar: true,
        data: { blocks: [] },
        tools: {
          header: Header,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: "/api/link",
            },
          },
          // upload image using uploadthing
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  let res = await uploadFiles({
                    files: [file],
                    endpoint: "imageUploader",
                  });

                  return {
                    success: 1,
                    file: {
                      url: res[0].fileUrl,
                    },
                  };
                },
              },
            },
          },

          list: List,
          code: Code,
          inlinecode: InlineCode,
          table: Table,
          embed: Embed,
        },
      });
    }
  }, []);

  useEffect(() => {
    if (Object.keys(errors).length) {
      for (const [_key, value] of Object.entries(errors)) {
        value;
        toast({
          title: "Something went wrong.",
          description: (value as { message: string }).message,
          variant: "destructive",
        });
      }
    }
  }, [errors]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    let init = async () => {
      await initializeEditor();

      setTimeout(() => {
        _titleRef?.current?.focus();
      }, 0);
    };
    if (isMounted) {
      init();
      return () => {
        editorRef.current?.destroy();
        editorRef.current = undefined;
      };
    }
  }, [isMounted, initializeEditor]);

  let onSubmit = async (data: FormData) => {
    let block = await editorRef.current?.save();

    let payload: PostCreationRequest = {
      title: data.title,
      content: block,
      subredditId,
    };

    createPost(payload);
  };

  if (!isMounted) {
    return null;
  }

  let { ref: titleRef, ...rest } = register("title");

  return (
    <div className="w-full p-4 bg-zinc-50 rounded-lg border border-zinc-200">
      <form
        id="subreddit-post-form"
        className="w-fit"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="prose prose-stone dark:prose-invert">
          <TextareaAutosize
            ref={(e) => {
              titleRef(e);
              /* @ts-ignore */
              _titleRef.current = e;
            }}
            {...rest}
            placeholder="Title"
            className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
          />
          <div id="editor" className="min-h-[500px]" />
        </div>
      </form>
    </div>
  );
};

export default Editor;
