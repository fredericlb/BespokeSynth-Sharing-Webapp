import { IconButton, Modal } from "@fluentui/react";
import React, { useEffect } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import $ from "../theme/modal";

const TextModal: React.FC<{
  type: "comment" | "python";
  content: string;
  onClose?: () => void;
  title: string;
}> = ({ type, content, title, onClose = () => {} }) => {
  useEffect(() => {
    const hasVerticalScrollbar =
      document.body.scrollHeight > document.body.clientHeight;

    if (hasVerticalScrollbar) {
      document.body.classList.add($.docBodyFix);
    }

    return () => {
      if (hasVerticalScrollbar) {
        document.body.classList.remove($.docBodyFix);
      }
    };
  });
  return (
    <Modal
      isOpen
      onDismiss={onClose}
      isBlocking
      containerClassName={$.container}
    >
      <div className={$.header}>
        <span>{title}</span>
        <IconButton
          className={$.closeIcon}
          iconProps={{ iconName: "Cancel" }}
          onClick={onClose}
        />
      </div>
      <div className={$.body}>
        <div className={$.textRead}>
          {type === "python" ? (
            <SyntaxHighlighter language="python" style={docco}>
              {content}
            </SyntaxHighlighter>
          ) : (
            <SyntaxHighlighter language="markdown" style={docco}>
              {content}
            </SyntaxHighlighter>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default TextModal;
