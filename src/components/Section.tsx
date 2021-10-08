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

    [MOBILE]: {
      paddingTop: 70,
    },
  },
});

const Section: React.FC = ({ children }) => (
  <section className={$.root}>{children}</section>
);

export default Section;
