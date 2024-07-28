import React, { useState, useCallback } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  useReactFlow,
  addEdge,
  Connection,
  EdgeChange,
  NodeChange,
  XYPosition,
  ReactFlowProvider,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import nodeTypes from "./Nodes/nodeTypes";
import { useLLMContext } from "../contexts/LLMContext";
import useCustomContextMenu from "../hooks/useCustomContextMenu";

const initialNodes: Node[] = [
  {
    id: "1",
    type: "llm",
    position: { x: 250, y: 5 },
    data: { label: "Node 1" },
  },
  {
    id: "2",
    type: "llm",
    position: { x: 250, y: 7 },
    data: { label: "Node 2" },
  },
];

function MainFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  //   const reactFlowInstance = useReactFlow();
  const contextMenu = useCustomContextMenu();

  const createNewNode = (position: XYPosition) => {
    const newNode: Node = {
      id: `${Date.now()}`,
      type: "custom",
      position,
      data: { label: `Node ${nodes.length + 1}` },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  //   const createNewNodeAtMousePosition = (event: React.MouseEvent) => {
  //     const position = reactFlowInstance.screenToFlowPosition({
  //       x: event.clientX,
  //       y: event.clientY,
  //     });
  //     createNewNode(position);
  //   };

  //   const onConnect = useCallback(
  //     (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
  //     [setEdges]
  //   );

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handlePaneClick = () => {
    if (contextMenu.isOpen) {
      contextMenu.hide();
    }
  };

  //   const handleNodeLabelChange = useCallback(
  //     (nodeId: string, newLabel: string) => {
  //       setNodes((nds) =>
  //         nds.map((node) => {
  //           if (node.id === nodeId) {
  //             return { ...node, data: { ...node.data, label: newLabel } };
  //           }
  //           return node;
  //         })
  //       );
  //     },
  //     [setNodes]
  //   );

  const handlePaneContextMenu = (event: React.MouseEvent) => {
    console.log("handlePaneContextMenu");
    event.preventDefault();
    contextMenu.show(event, PaneContextMenu);
  };

  return (
    <div className="w-screen h-screen">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneClick={handlePaneClick}
        // onPaneContextMenu={handlePaneContextMenu}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <contextMenu.ContextMenu />
      </ReactFlow>
    </div>
  );
}

//Wraps flow in ReactFlowProvider
export default function MainFlowWrapper() {
  return (
    <ReactFlowProvider>
      <MainFlow />
    </ReactFlowProvider>
  );
}

function PaneContextMenu(props: { closeMenu: () => void }) {
  return <div className="w-40 h-60 border-2 bg-inherit">hi</div>;
}
