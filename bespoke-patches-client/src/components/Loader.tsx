import { mergeStyleSets } from "@fluentui/merge-styles";
import React from "react";
import { createPortal } from "react-dom";
import { RingLoader } from "react-spinners";

const $ = mergeStyleSets({
  full: {
    pointerEvents: "none",
    width: "100vw",
    height: "calc(100vh - 50px)",
    marginTop: 50,
    display: "flex",
    position: "fixed",
    top: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});

const Loader: React.FC<{ full: boolean }> = ({ full }) =>
  createPortal(
    <div className={$.full}>
      <RingLoader color="#ffffff" size={120} />
    </div>,
    document.body
  );

export default Loader;
