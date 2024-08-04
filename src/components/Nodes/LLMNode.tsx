//================ ORIG before extracting UI and common state management to NodeWrapper
import React, {
  useState,
  useCallback,
  useLayoutEffect,
  useEffect,
} from "react";
import {
  Handle,
  Position,
  NodeProps,
  NodeToolbar,
  useReactFlow,
  useNodesData,
  useHandleConnections,
  NodeResizer,
  NodeResizeControl,
} from "@xyflow/react";
import { MoveDiagonal2, PlaySquare } from "lucide-react";
import { NodeTextArea } from "../NodeUIElements";
import { useLLMContext, LLMPROVIDER } from "../../contexts/LLMContext";

interface LLMNodeState {
  // title:string; TODO: Generate this
  inputPrompt: string;
  output: string;
  isEnabled: boolean;
}

interface LLMNodeUIState {
  isRunning: boolean;
}

const DEFAULT_LLMNODE_STATE: LLMNodeState = {
  inputPrompt: "",
  output: "",
  isEnabled: true,
};

export default function LLMNode(props: NodeProps) {
  const reactFlow = useReactFlow();
  const LLM = useLLMContext();
  const [state, setState] = useState<LLMNodeState>(
    (props.data.state as LLMNodeState) || DEFAULT_LLMNODE_STATE
  );
  const [uiState, setUiState] = useState<LLMNodeUIState>({ isRunning: false });

  // const handleDoubleClick = useCallback(() => {
  //   setIsEditing(true);
  // }, []);

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
  const sourceNodeState = (nodesData?.data?.state as LLMNodeState) || undefined;
  const sourceNodeOutput = sourceNodeState?.output;

  const updateState = (update: Partial<LLMNodeState>) => {
    setState((prev) => ({ ...prev, ...update } as LLMNodeState));
    // reactFlow.updateNodeData(props.id, update);
  };

  const run = async () => {
    // if (state?.inputPrompt.length === 0) return;
    if (!state.isEnabled) {
      return;
    }
    setUiState((prev) => ({ ...prev, isRunning: true }));
    const msg = (state?.inputPrompt || "") + "\n" + (sourceNodeOutput || "");
    const replyText = await LLM.sendMessage(LLMPROVIDER.OPENAI, msg);
    console.log("node>run>response: ", replyText);
    updateState({ output: replyText });
    setUiState((prev) => ({ ...prev, isRunning: false }));
  };

  useEffect(() => {
    if (sourceNodeOutput === undefined || sourceNodeOutput.length === 0) return; //TODO: Consider adding option that allows nodes to run with empty output from source; but note that this currently causes a run to be triggered upon connecting nodes.
    run();
  }, [sourceNodeOutput]);

  useEffect(() => {
    // console.log(`Node ${props.id} stateChanged: ${JSON.stringify(state)}`);
    reactFlow.updateNodeData(props.id, { state });
  }, [state]);

  useLayoutEffect(() => {
    if (props.data.state && props.data.state != state) {
      logNodeMessage(`State Updated`, { internalState: true });
      setState(props.data.state as LLMNodeState);
    }
  }, [props.data.state]);

  const logNodeMessage = (
    message: string,
    debugInfo?: {
      nodeProps?: boolean;
      nodeData?: boolean;
      internalState?: boolean;
    }
  ) => {
    //TODO: Extract to nodelog hook; expand to handle general logging
    let msg = `Node ${props.id}: ${message}`;
    msg += `${
      debugInfo?.nodeProps ? "\nNodeProps: " + JSON.stringify(props) : ""
    }`;
    msg += `${
      debugInfo?.nodeData ? "\nNodeData: " + JSON.stringify(props.data) : ""
    }`;
    msg += `${
      debugInfo?.internalState
        ? "\nInternalState: " + JSON.stringify(state)
        : ""
    }`;

    console.log(msg);
  };

  return (
    <>
      <NodeResizeControl minWidth={200} minHeight={270}>
        {/* <div className="resize absolute bottom-1 right-1 size-10" /> */}
        {/* <div className="resize-x absolute h-full w-1 border-2 border-red-500" /> */}
        <MoveDiagonal2
          className="absolute -bottom-2 -right-2 opacity-30 hover:opacity-90"
          size={24}
        />
      </NodeResizeControl>

      <div
        className={`flex flex-col flex-grow place-content-center border-2 border-slate-600 rounded-md bg-white p-4 gap-2 size-full ${
          uiState.isRunning && "animate-pulse"
        } ${props.selected && "outline outline-offset-2 outline-blue-500"}`}
      >
        <Handle type="target" position={Position.Top} />
        <div className="flex justify-between">
          <div className="font-bold">
            Node: {props.data.creationIndex as string}
          </div>
          <div className="flex flex-row place-content-center justify-center items-center size-fit gap-2">
            <input
              type="checkbox"
              className={`toggle toggle-md toggle-success flex-1`}
              checked={state.isEnabled}
              onChange={(e) => updateState({ isEnabled: e.target.checked })}
            />
            <button
              onClick={run}
              className="btn btn-ghost btn-square flex-1 p-0 text-slate-600"
            >
              <PlaySquare size={36} />
            </button>
          </div>
        </div>
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
          className="flex-1 resize-none"
          // autoFocus
        />
        <NodeTextArea
          value={state?.output}
          onChange={(e) => updateState({ output: e.target.value })}
          className="flex-1 resize-none"
        />

        <Handle type="source" position={Position.Bottom} className="size-3" />
      </div>
    </>
  );
}
