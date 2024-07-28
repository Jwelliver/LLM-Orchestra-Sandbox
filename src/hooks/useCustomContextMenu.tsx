import { useState } from "react";
import { XYPosition, useReactFlow } from "@xyflow/react";

export type ContextMenuComponentProps = React.FC<{
  closeMenu: () => void;
  [k: string]: any;
}>;

export interface ContextMenuDisplayState {
  pos: XYPosition;
  component: ContextMenuComponentProps;
}

export default function useCustomContextMenu() {
  const [contextMenu, setContextMenu] =
    useState<ContextMenuDisplayState | null>();

  const reactFlowInstance = useReactFlow();

  const isOpen = contextMenu !== null;

  const show = (e: React.MouseEvent, component: ContextMenuComponentProps) => {
    const mousePos: XYPosition = { x: e.clientX, y: e.clientY };
    const converted = reactFlowInstance.screenToFlowPosition(mousePos);
    console.log(
      `useCustomContextMenu.show() > pos:${JSON.stringify(
        mousePos
      )} | converted: ${JSON.stringify(converted)}`
    );
    setContextMenu({ pos: mousePos, component });
  };

  const hide = () => {
    setContextMenu(null);
  };

  const ContextMenu = () => {
    return (
      <>
        {contextMenu ? (
          <div
            className="absolute z-50"
            style={{ top: contextMenu.pos.y, left: contextMenu.pos.x }}
            autoFocus
            onBlur={hide}
          >
            <contextMenu.component closeMenu={hide} />
          </div>
        ) : null}
      </>
    );
  };

  return { show, hide, ContextMenu, isOpen, position: contextMenu?.pos };
}
