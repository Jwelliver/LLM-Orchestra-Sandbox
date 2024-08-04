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
  OnConnectStartParams,
  OnConnectEnd,
} from "@xyflow/react";
import "@xyflow/react/dist/base.css"; //*Required
// import "@xyflow/react/dist/style.css";
import { nodeTypes, NODE_DEFINITIONS, NodeTypeId } from "./Nodes/nodeTypes";
import { useLLMContext } from "../contexts/LLMContext";
import useCustomContextMenu from "../hooks/useCustomContextMenu";
import useAddNodeOnEdgeDrop from "../hooks/useAddNodeOnEdgeDrop";
import useFlowUtils from "../hooks/useFlowUtils";
import SaveLoadPanel from "./SaveLoadPanel";

const initialNodes: Node[] = [
  // {
  //   id: "1",
  //   type: "llm",
  //   position: { x: 250, y: 5 },
  //   data: {},
  // },
  // {
  //   id: "2",
  //   type: "llm",
  //   position: { x: 250, y: 7 },
  //   data: {},
  // },
];

function MainFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // const addNodeOnEdgeDrop = useAddNodeOnEdgeDrop();

  const reactFlowInstance = useReactFlow();
  const contextMenu = useCustomContextMenu();

  // const onConnectStart = useCallback(
  //   (e: MouseEvent | TouchEvent, params: OnConnectStartParams) => {
  //     // addNodeOnEdgeDrop.setConnectingNodeId(params.nodeId);
  //   },
  //   []
  // );

  //   const onConnect = useCallback(
  //     (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
  //     [setEdges]
  //   );

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds));
      // addNodeOnEdgeDrop.onConnect();
      // addNodeOnEdgeDrop.setConnectingNodeId(null);
    },
    [setEdges]
  );

  // const onConnectEnd = useCallback((e: MouseEvent) => {
  //   addNodeOnEdgeDrop.onConnectEnd(e);
  // }, []);

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

  const handlePaneContextMenu = (event: MouseEvent | React.MouseEvent) => {
    console.log("handlePaneContextMenu");
    event.preventDefault();
    contextMenu.show(event, PaneContextMenu);
  };

  return (
    <div className="w-screen h-screen">
      <ReactFlow
        // colorMode="dark"
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        // onConnectStart={onConnectStart}
        // onConnectEnd={onConnectEnd as OnConnectEnd}
        onPaneClick={handlePaneClick}
        onPaneContextMenu={handlePaneContextMenu}
        nodeTypes={nodeTypes}
        fitView
      >
        <Panel position="top-left">
          <SaveLoadPanel />
        </Panel>
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

function PaneContextMenu(props: {
  //TODO: Move to own module
  closeMenu: () => void;
  contentMenuMousePos: XYPosition;
}) {
  const flowUtils = useFlowUtils();

  //TODO: Only using the NewNode menu at the moment; The menu UI and component structure may require refactoring when adding submenus/state to the PaneContextMenu component. e.g. SubMenu component that takes title and items
  const NewNodeSubMenu = () => {
    const onCreateNewNode = (nodeTypeId: NodeTypeId) => {
      flowUtils.createNewNode(nodeTypeId, props.contentMenuMousePos);
      props.closeMenu();
    };

    return (
      <>
        <h3 className="menu-title">New Node:</h3>
        <ul className="menu">
          {Object.keys(NODE_DEFINITIONS).map((k, i) => {
            const nodeDef = NODE_DEFINITIONS[k];
            return (
              <li onClick={() => onCreateNewNode(k)} key={k}>
                <a>{nodeDef.name}</a>
              </li>
            );
          })}
        </ul>
      </>
    );
  };

  return (
    <div className="w-40 h-60 border-2 bg-white bg-opacity-100 rounded-box drop-shadow size-fit p-4">
      <NewNodeSubMenu />
    </div>
  );
}
