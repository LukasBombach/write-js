import React from "react";
import useDocument from "../hooks/useDocument";
import type { Node } from "../hooks/useDocument";

const initalDocument: Node = {
  id: 0,
  children: [{ id: 1, text: "hello world" }],
};

const Verne = () => {
  const children = useDocument(initalDocument);
  return (
    <div contentEditable={true} suppressContentEditableWarning={true}>
      {children}
    </div>
  );
};

export default Verne;