import { mergeStyleSets } from "@fluentui/merge-styles";

const modalStyles = mergeStyleSets({
  container: {
    maxWidth: "80vw",
    background: "#343434",
  },
  header: [
    {
      flex: "1 1 auto",
      display: "flex",
      alignItems: "center",
      fontWeight: 600,
      padding: "12px 12px 14px 24px",
    },
  ],
  body: {
    flex: "4 4 auto",
    padding: "0 24px 24px 24px",
    overflowY: "hidden",
    selectors: {
      p: { margin: "14px 0" },
      "p:first-child": { marginTop: 0 },
      "p:last-child": { marginBottom: 0 },
    },
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    paddingRight: "24px",
    paddingBottom: "16px",
  },
  closeIcon: {
    color: "#ABABAB",
    marginLeft: "auto",
    marginTop: "4px",
    marginRight: "2px",
  },
  closeIconHovered: {
    color: "#676767",
  },
  textRead: {
    maxHeight: 500,
    minHeight: 120,
    minWidth: "40vw",
    overflowY: "scroll",
    overflowX: "auto",
    fontFamily: "monospace",
    whiteSpace: "pre",
    background: "#f8f8ff",
  },
});

export default modalStyles;
