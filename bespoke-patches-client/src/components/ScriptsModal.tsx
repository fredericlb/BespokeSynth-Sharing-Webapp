import {
  DefaultButton,
  IconButton,
  Modal,
  Pivot,
  PivotItem,
  PrimaryButton,
} from "@fluentui/react";
import React, { Suspense, useEffect } from "react";
import { useTranslation } from "react-i18next";
import $ from "../theme/modal";

const SyntaxHighlighter = React.lazy(() => import("./SyntaxHighlighter"));

const ScriptsModal: React.FC<{
  scripts: { name: string; content: string }[];
  onClose?: () => void;
  onEnd: (valid: boolean) => void;
}> = ({ scripts, onClose = () => {}, onEnd }) => {
  const { t } = useTranslation();
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
        <span>{t("ScriptsModal.title")}</span>
        <IconButton
          className={$.closeIcon}
          iconProps={{ iconName: "Cancel" }}
          onClick={onClose}
        />
      </div>
      <div className={$.body}>
        <p
          style={{
            maxWidth: "50vw",
            background: "#CDCDCD",
            color: "#010101",
            padding: 5,
            borderRadius: 5,
          }}
        >
          {t("ScriptsModal.intro")}
        </p>
        <Pivot>
          {scripts.map(({ name, content }) => (
            <PivotItem headerText={name}>
              <div className={$.textRead}>
                <Suspense fallback="...">
                  <SyntaxHighlighter language="python">
                    {content}
                  </SyntaxHighlighter>
                </Suspense>
              </div>
            </PivotItem>
          ))}
        </Pivot>
      </div>
      <div className={$.footer}>
        <DefaultButton onClick={() => onEnd(false)} style={{ marginRight: 16 }}>
          {t("ScriptsModal.cancel")}
        </DefaultButton>
        <PrimaryButton onClick={() => onEnd(true)}>
          {t("ScriptsModal.download")}
        </PrimaryButton>
      </div>
    </Modal>
  );
};

export default ScriptsModal;
