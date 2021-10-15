import { mergeStyleSets } from "@fluentui/merge-styles";
import React from "react";
import { MOBILE } from "../theme/constants";

const $ = mergeStyleSets({
  root: {
    paddingTop: 50,
    maxWidth: 1024,
    paddingLeft: 20,
    paddingRight: 20,
    margin: "auto",
    marginBottom: 30,
    boxSizing: "border-box",
    minHeight: "calc(100vh - 80px)",
    [MOBILE]: {
      paddingTop: 70,
      minHeight: "calc(100vh - 100px)",
    },
  },
});

const Section: React.FC = ({ children }) => (
  <section className={$.root}>{children}</section>
);

export default Section;
