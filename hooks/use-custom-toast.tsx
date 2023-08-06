import Link from "next/link";
import { toast } from "./use-toast";
import { buttonVariants } from "@/components/ui/Button";

export let useCustomToast = () => {
  let loginToast = () => {
    let { dismiss } = toast({
      title: "Login required",
      description: "You need to be logged in to do that ...",
      variant: "destructive",
      action: (
        <Link
          href="/sign-in"
          onClick={() => dismiss()}
          className={buttonVariants({ variant: "outline" })}
        >
          login
        </Link>
      ),
    });
  };
  let loginToastVote = () => {
    let { dismiss } = toast({
      title: "Login required",
      description: "You must be Logged In to do votes",
      variant: "destructive",
      action: (
        <Link
          href="/sign-in"
          onClick={() => dismiss()}
          className={buttonVariants({ variant: "outline" })}
        >
          login
        </Link>
      ),
    });
  };

  let loginToastComment = () => {
    let { dismiss } = toast({
      title: "Login required",
      description: "You must be Logged In to do comments",
      variant: "destructive",
      action: (
        <Link
          href="/sign-in"
          onClick={() => dismiss()}
          className={buttonVariants({ variant: "outline" })}
        >
          login
        </Link>
      ),
    });
  };

  return { loginToast, loginToastVote, loginToastComment };
};
