"use client";

import dynamic from "next/dynamic";
import { FC } from "react";
import CustomImageRenderer from "./renderers/CustomImageRenderer";
import CustomCodeRenderer from "./renderers/CustomCodeRenderer";

let Output = dynamic(
  async () => (await import("editorjs-react-renderer")).default,
  { ssr: false }
);

interface EditorOutputProps {
  content: any;
}

let renderers = {
  image: CustomImageRenderer,
  code: CustomCodeRenderer,
};

let style = {
  paragraph: {
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
  },
};

const EditorOutput: FC<EditorOutputProps> = ({ content }) => {
  return (
    <Output
      data={content}
      style={style}
      className="text-sm "
      renderers={renderers}
    />
  );
};

export default EditorOutput;
