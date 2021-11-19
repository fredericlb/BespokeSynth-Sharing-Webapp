import React from "react";
import { Light as SyntaxHighlighterCore } from "react-syntax-highlighter";
import markdown from "react-syntax-highlighter/dist/esm/languages/hljs/markdown";
import python from "react-syntax-highlighter/dist/esm/languages/hljs/python";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

SyntaxHighlighterCore.registerLanguage(python, "python");
SyntaxHighlighterCore.registerLanguage(markdown, "markdown");

const SyntaxHighlighter: React.FC<{ language: "python" | "markdown" }> = ({
  language,
  children,
}) => (
  <SyntaxHighlighterCore language={language} style={docco}>
    {children}
  </SyntaxHighlighterCore>
);

export default SyntaxHighlighter;
