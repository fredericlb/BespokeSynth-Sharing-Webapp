import { mergeStyleSets } from "@fluentui/merge-styles";
import React from "react";
import { RingLoader } from "react-spinners";

const $ = mergeStyleSets({
  full: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    position: "fixed",
    top: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});

const Loader: React.FC<{ full: boolean }> = ({ full }) => (
  <div className={$.full}>
    <RingLoader color="#ffffff" size={120} />
  </div>
);

export default Loader;
