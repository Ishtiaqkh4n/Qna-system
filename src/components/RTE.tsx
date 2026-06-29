"use client";

import dynamic from "next/dynamic";
import type { MDEditorProps } from "@uiw/react-md-editor";
import Editor from "@uiw/react-md-editor";

const RTEDynamic = dynamic<MDEditorProps>(
    () => import("@uiw/react-md-editor").then(mod => mod.default),
    { ssr: false }
);

export const MarkdownPreview = Editor.Markdown;

const RTE = (props: MDEditorProps) => <RTEDynamic {...props} />;

export default RTE;
