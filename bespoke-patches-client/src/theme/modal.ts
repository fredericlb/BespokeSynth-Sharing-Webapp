import { mergeStyleSets } from "@fluentui/merge-styles";

const modalStyles = mergeStyleSets({
  docBodyFix: {
    paddingRight: 18,
  },
  container: {
    maxWidth: "70vw",
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
    maxHeight: "50vh",
    minHeight: "50vh",
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
    marginTop: "24px"
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
    minWidth: "40vw",
    maxWidth: "50vw",
    maxHeight: "50vh",
    overflowY: "scroll",
    overflowX: "auto",
    fontFamily: "monospace",
    whiteSpace: "pre",
    background: "#f8f8ff",
  },
});

export default modalStyles;
