import { mergeStyleSets } from "@fluentui/merge-styles";
import React from "react";

const $ = mergeStyleSets({
  sectionTitle: {
    marginTop: 32,
    marginBottom: 16,
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#ABABAB",
    textTransform: "lowercase",
    selectors: {
      "::before": {
        content: "/",
      },
    },
  },
});

const SectionTitle: React.FC = ({ children }) => (
  <h2 className={$.sectionTitle}>/{children}</h2>
);

export default SectionTitle;
