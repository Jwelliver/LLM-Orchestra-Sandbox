import React, { useState, useCallback, useEffect } from "react";
import {
  Handle,
  Position,
  NodeProps,
  NodeToolbar,
  useReactFlow,
  useNodesData,
  useHandleConnections,
} from "@xyflow/react";
import { NodeTextArea } from "../NodeUIElements";
import { useLLMContext, LLMPROVIDER } from "../../contexts/LLMContext";

interface LLMNodeState {
  // title:string; TODO: Generate this
  inputPrompt: string;
  output: string;
}

export default function LLMNode(props: NodeProps) {
  const reactFlow = useReactFlow();
  const LLM = useLLMContext();
  const [isEditing, setIsEditing] = useState(false);
  const [state, setState] = useState<LLMNodeState>(); //TODO: data.label; Find out where data is coming from

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  // const handleBlur = useCallback(() => {
  //   setIsEditing(false);
  //   data.onLabelChange(id, label);
  // }, [id, label, data]);

  // const handleChange = useCallback(
  //   (evt: React.ChangeEvent<HTMLInputElement>) => {
  //     setLabel(evt.target.value);
  //   },
  //   []
  // );
  // console.log(data, id);

  const connections = useHandleConnections({
    type: "target",
  });
  const nodesData = useNodesData(connections[0]?.source); //todo: set type to llmnode
  const sourceNodeOutput = nodesData?.data.output;

  const updateState = (update: Partial<LLMNodeState>) => {
    setState((prev) => ({ ...prev, ...update } as LLMNodeState));
    reactFlow.updateNodeData(props.id, update);
  };

  const run = async () => {
    // if (state?.inputPrompt.length === 0) return;
    const msg =
      (state?.inputPrompt || "") + " " + (nodesData?.data.output || "");
    const replyText = await LLM.sendMessage(LLMPROVIDER.OPENAI, msg);
    console.log("node>run>response: ", replyText);
    updateState({ output: replyText });
  };

  useEffect(() => {
    if (nodesData?.data?.output === undefined) return;
    // updateState({
    //   inputPrompt:
    //     (state?.inputPrompt || "") + " " + (nodesData?.data.output || ""),
    // });
    run();
  }, [sourceNodeOutput]);

  //   useEffect(() => {
  //     reactFlow.updateNodeData(props.id, state);
  //   }, []);

  return (
    <div className="flex flex-col place-content-center border-2 border-slate-600 rounded-md bg-white p-4 gap-2 size-fit">
      <Handle type="target" position={Position.Top} />
      {/* <NodeToolbar
        isVisible={props.data.toolbarVisible}
        position={props.data.toolbarPosition}
      >
        <button>delete</button>
        <button>copy</button>
        <button>expand</button>
      </NodeToolbar> */}
      <NodeTextArea
        value={state?.inputPrompt}
        onChange={(e) => updateState({ inputPrompt: e.target.value })}
        // onBlur={handleBlur}
        autoFocus
      />
      <NodeTextArea value={state?.output} />

      <button className="btn btn-sm" onClick={run}>
        Run
      </button>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
