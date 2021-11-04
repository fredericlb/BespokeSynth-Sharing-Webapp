import React, { useCallback, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  Elements,
  isNode,
  Node,
} from "react-flow-renderer";
import { Module } from "../hooks/patch.types";
import TextModal from "./TextModal";

const nodeWidth = 172;
const nodeHeight = 36;

const BSKViz: React.FC<{ modules: Module[] }> = ({ modules }) => {
  const [modalContent, setModalContent] =
    useState<{ content: string; type: "comment" | "python"; title: string }>();

  const cables: Edge[] = useMemo(
    () =>
      modules.flatMap((m, i) =>
        (m.target || "")
          .split(",")
          .filter((t) => t !== "")
          .map((t) => {
            const j = modules.findIndex((n) => n.name === t);
            return {
              id: `${i}-${j}`,
              source: `${i}`,
              target: `${j}`,
              animated: true,
            };
          })
      ),
    [modules]
  );

  const nodes: Elements = useMemo(
    () =>
      modules.map((m, i) => {
        let backgroundColor = "#efefef";
        if (m.script) {
          backgroundColor = "#AAffAA";
        } else if (m.comment) {
          backgroundColor = "#AAAAff";
        }
        return {
          id: `${i}`,
          type: "default",
          data: { label: m.name, i },
          style: {
            width: "auto",
            fontSize: "12px",
            cursor: m.script || m.comment ? "pointer" : "default",
            backgroundColor,
          },
          position: { x: m.position[0] / 1.2, y: m.position[1] / 1.5 },
        };
      }),
    [modules]
  );

  const elements = useMemo(() => [...nodes, ...cables], [nodes, cables]);
  const onClick = useCallback(
    (elt: Node) => {
      const module = modules[elt.data.i];
      if (module.script != null) {
        setModalContent({
          content: module.script,
          type: "python",
          title: module.name,
        });
      } else if (module.comment) {
        setModalContent({
          content: module.comment,
          type: "comment",
          title: module.name,
        });
      }
    },
    [modules]
  );

  return (
    <div style={{ width: "100%", height: 300, backgroundColor: "#343434" }}>
      {modalContent && (
        <TextModal
          content={modalContent.content}
          title={modalContent.title}
          type={modalContent.type}
          onClose={() => setModalContent(undefined)}
        />
      )}
      <ReactFlow
        minZoom={0.1}
        maxZoom={10}
        elements={elements}
        onLoad={(instance) => instance.fitView()}
        nodesDraggable={false}
        nodesConnectable={false}
        onElementClick={(_, elt) => isNode(elt) && onClick(elt)}
      >
        <Controls showInteractive={false} />
        <Background variant={BackgroundVariant.Dots} color="#ff00ff" gap={16} />
      </ReactFlow>
    </div>
  );
};

export default BSKViz;
