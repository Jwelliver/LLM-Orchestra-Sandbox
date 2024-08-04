/**
 * Import and define node types here.
 * nodeTypes is provided as prop to ReactFlow component
 */

import LLMNode from "./LLMNode";

type NodeComponentType = React.FC<any>; //TODO: Define a type that custom node components must adhere to

export type NodeDefinition = {
  name: string;
  component: NodeComponentType;
};

//NODE_DEFINITIONS stores meta data like displayName, and other potential attributes (like constraints or restrictions)
const NODE_DEFINITIONS: { [k: string]: NodeDefinition } = {
  llm: {
    name: "LLM",
    component: LLMNode,
  },
};

export type NodeTypeId = keyof typeof NODE_DEFINITIONS;

//NodeTypes just lists each nodeType in the format that will be passed to ReactFlow
const nodeTypes: { [k in NodeTypeId]: NodeComponentType } = {};
//Generate NodeTypes from node definitions
Object.keys(NODE_DEFINITIONS).forEach((k: string) => {
  nodeTypes[k] = NODE_DEFINITIONS[k].component;
});

export { nodeTypes, NODE_DEFINITIONS };
