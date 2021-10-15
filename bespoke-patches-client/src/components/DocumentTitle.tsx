import React from "react";
import useTitle from "../hooks/useTitle";

const DocumentTitle: React.FC = ({ children }) => {
  useTitle(children as string);

  return null;
};

export default DocumentTitle;
