import { IconButton, Modal } from "@fluentui/react";
import React, { Suspense, useEffect } from "react";
import $ from "../theme/modal";

const SyntaxHighlighter = React.lazy(() => import("./SyntaxHighlighter"));

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
          <Suspense fallback="...">
            {type === "python" ? (
              <SyntaxHighlighter language="python">{content}</SyntaxHighlighter>
            ) : (
              <SyntaxHighlighter language="markdown">
                {content}
              </SyntaxHighlighter>
            )}
          </Suspense>
        </div>
      </div>
    </Modal>
  );
};

export default TextModal;
