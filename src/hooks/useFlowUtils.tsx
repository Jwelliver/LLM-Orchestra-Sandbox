import { useReactFlow, XYPosition, Node } from "@xyflow/react";
import { NodeTypeId } from "../components/Nodes/nodeTypes";
import { ulid } from "ulidx";

export default function useFlowUtils() {
  const reactFlowInstance = useReactFlow();

  const getNodeCreationIndex = (nodeId: string) => {
    //get existing node ULIDs
    const nodeUlids = reactFlowInstance.getNodes().map((n) => n.id);
    //if the target nodeId doesn't exist in the array, add it.
    if (!nodeUlids.includes(nodeId)) {
      nodeUlids.push(nodeId);
    }
    //sort the ulids
    nodeUlids.sort((a, b) => a.localeCompare(b));

    return nodeUlids.indexOf(nodeId);
  };

  const createNewNode = (type: NodeTypeId, position: XYPosition) => {
    const id = ulid();
    const creationIndex = getNodeCreationIndex(id);
    const newNode: Node = {
      id,
      type: type as string,
      position,
      data: { creationIndex },
    };
    reactFlowInstance.addNodes(newNode);
  };

  const createNewNodeAtMousePosition = (
    //TODO: Instead of needing to pass the mouse event, we could just track mousePosition here in a ref, then use that
    type: NodeTypeId,
    event: React.MouseEvent
  ) => {
    const position = reactFlowInstance.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });
    createNewNode(type, position);
  };

  return { createNewNode, createNewNodeAtMousePosition };
}
