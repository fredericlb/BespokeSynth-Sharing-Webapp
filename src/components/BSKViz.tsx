import dagre from "dagre";
import React, { useCallback, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  Elements,
  isNode,
  Node,
  Position,
} from "react-flow-renderer";
import { Module } from "../hooks/patch.types";
import TextModal from "./TextModal";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutedElements = (elements: Elements) => {
  dagreGraph.setGraph({ rankdir: "TB" });

  elements.forEach((el) => {
    if (isNode(el)) {
      dagreGraph.setNode(el.id, { width: nodeWidth, height: nodeHeight });
    } else {
      dagreGraph.setEdge(el.source, el.target);
    }
  });

  dagre.layout(dagreGraph);

  return elements.map((el) => {
    if (isNode(el)) {
      const nodeWithPosition = dagreGraph.node(el.id);
      el.targetPosition = Position.Top;
      el.sourcePosition = Position.Bottom;

      // unfortunately we need this little hack to pass a slightly different position
      // to notify react flow about the change. Moreover we are shifting the dagre node position
      // (anchor=center center) to the top left so it matches the react flow node anchor point (top left).
      el.position = {
        x: nodeWithPosition.x - nodeWidth / 2 + Math.random() / 1000,
        y: nodeWithPosition.y - nodeHeight / 2,
      };
    }

    return el;
  });
};

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
