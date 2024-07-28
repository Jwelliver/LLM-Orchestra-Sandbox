import React, { useState, useCallback } from "react";
import { Handle, Position, NodeProps, NodeToolbar } from "@xyflow/react";
import { NodeTextArea } from "../NodeUIElements";

interface LLMNodeState {
  // title:string; TODO: Generate this
  inputPrompt: string;
}

export default function LLMNode(props: NodeProps) {
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

  const updateState = (update: Partial<LLMNodeState>) => {
    setState((prev) => ({ ...prev, ...update } as LLMNodeState));
  };

  return (
    <div className="border-2 border-slate-600 rounded-md bg-white">
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
        className="m-2"
        value={state?.inputPrompt}
        onChange={(e) => updateState({ inputPrompt: e.target.value })}
        // onBlur={handleBlur}
        autoFocus
      />

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

///======== orig 1
// import React, { useState, useCallback } from "react";
// import { Handle, Position, NodeProps } from "@xyflow/react";

// const CustomNode: React.FC<NodeProps> = ({ data, id }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [label, setLabel] = useState(data.label);

//   const handleDoubleClick = useCallback(() => {
//     setIsEditing(true);
//   }, []);

//   const handleBlur = useCallback(() => {
//     setIsEditing(false);
//     data.onLabelChange(id, label);
//   }, [id, label, data]);

//   const handleChange = useCallback(
//     (evt: React.ChangeEvent<HTMLInputElement>) => {
//       setLabel(evt.target.value);
//     },
//     []
//   );

//   return (
//     <div
//       style={{
//         background: "#fff",
//         padding: "10px",
//         border: "1px solid #ddd",
//         borderRadius: "5px",
//       }}
//     >
//       <Handle type="target" position={Position.Top} />
//       {isEditing ? (
//         <input
//           type="text"
//           value={label}
//           onChange={handleChange}
//           onBlur={handleBlur}
//           autoFocus
//         />
//       ) : (
//         <div onDoubleClick={handleDoubleClick}>{label}</div>
//       )}
//       <Handle type="source" position={Position.Bottom} />
//     </div>
//   );
// };

// export default CustomNode;
