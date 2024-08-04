import { useReactFlow, ReactFlowJsonObject } from "@xyflow/react";
import { useState, useRef, useEffect } from "react";

export type WorkspaceData = {
  title: string;
  flowObj: ReactFlowJsonObject;
};

const STORAGE_KEYS = {
  workspaces: "workspaces",
};

//TODO: Refactor to use UUID or ULID for workspace identification; using title as primary identifier is temp.
export default function useWorkspaceStorage() {
  const [autoSave, setAutoSave] = useState<boolean>(false); //TODO: When autosave is working; set to true by defualt
  const reactFlowInstance = useReactFlow();
  const isAutoSavePending = useRef<boolean>(true);

  const nodes = reactFlowInstance.getNodes();
  const edges = reactFlowInstance.getEdges();

  useEffect(() => {
    checkAutoSave();
  }, [nodes, edges]);

  const checkAutoSave = () => {
    //TODO: finish autosave delays so we don't save on every change.
    if (!autoSave || isAutoSavePending.current === true) return;
    // set isAutoSavePending ref flag to true
    isAutoSavePending.current = true;
    //set timeout with callback that performs save and resets canSave ref flag //TODO: Get title from somewhere to pass to save, or better, refactor so save gets the title data from context
    // async () =>
    //   setTimeout(() => {
    //     save;
    //     isAutoSavePending.current = false;
    //   }, 5000);
    //Also, make sure to update autosave state to use the state from here
  };

  //Returns map of saved workspaces by ID
  const getWorkspaceList = (): WorkspaceData[] => {
    const workspaces = localStorage.getItem(STORAGE_KEYS.workspaces);
    if (!workspaces) return [];
    return JSON.parse(workspaces);
  };

  const getWorkspaceByTitle = (title: string): WorkspaceData | undefined => {
    return getWorkspaceList().find((item) => item.title === title);
  };

  const save = (title: string) => {
    const flowObj = reactFlowInstance.toObject();
    const dataToSave: WorkspaceData = {
      title,
      flowObj,
    };
    const workspaces = getWorkspaceList();
    const existingIndex = workspaces.findIndex((item) => item.title === title);
    if (existingIndex > -1) {
      workspaces[existingIndex] = dataToSave;
    } else {
      workspaces.push(dataToSave);
    }
    //get id or title to use as key
    localStorage.setItem(STORAGE_KEYS.workspaces, JSON.stringify(workspaces));
  };

  const load = async (title: string) => {
    const workspace = getWorkspaceByTitle(title);
    if (!workspace) {
      throw new Error(`Workspace not found with title: ${title}`);
    }
    const data = workspace?.flowObj;

    const { x = 0, y = 0, zoom = 1 } = data.viewport;

    //Get existing nodes and edges to delete, then set the new nodes and edges from loaded data;
    //TODO: We should probably completely repload/replace the MainFlow or Workspace(not yet created) component to ensure all aspects of the workspace are replaced.
    const nodes = reactFlowInstance.getNodes();
    const edges = reactFlowInstance.getEdges();
    reactFlowInstance.deleteElements({ nodes, edges }).then(() => {
      reactFlowInstance.setNodes(data.nodes || []);
      reactFlowInstance.setEdges(data.edges || []);
      reactFlowInstance.setViewport({ x, y, zoom });
    });

    // console.log("Loaded: ", storageKey, dataStr);
  };

  return { save, load, getWorkspaceList, autoSave, setAutoSave };
}
