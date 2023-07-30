"use client";

import { FC } from "react";
import { Button } from "./ui/Button";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

const CloseModal = () => {
  let router = useRouter();
  return (
    <Button
      onClick={() => router.back()}
      className="h-6 w-6 p-0 rounded-md"
      aria-label="close modal"
      variant="subtle"
    >
      <X className="h-4 w-4" />
    </Button>
  );
};

export default CloseModal;
