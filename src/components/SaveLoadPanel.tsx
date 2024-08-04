import { useEffect, useRef, useState } from "react";
import useWorkspaceStorage, {
  WorkspaceData,
} from "../hooks/useWorkspaceStorage";

export default function SaveLoadPanel() {
  const workspaceStorage = useWorkspaceStorage();
  const [workspaceTitle, setWorkspaceTitle] = useState("My First App");
  const [showLoadModal, setShowLoadModal] = useState<boolean>(false);

  const loadWorkspace = (title: string) => {
    //TODO: This is a temp solution to ensure the workspaceTitle field is up to date with the loaded workspace; Instead, the workspaceTitle should be set by an "ActiveWorkspace" state somewhere.
    workspaceStorage.load(title);
    setWorkspaceTitle(title);
  };

  return (
    <div className="p-4 container border bg-slate-50 flex flex-row gap-6">
      <input
        className="input input-md text-xs"
        onChange={(e) => setWorkspaceTitle(e.target.value)}
        value={workspaceTitle}
        placeholder="Worspace Title"
      />
      <button
        className={`${workspaceTitle.length === 0 && "hidden"}`}
        onClick={() => workspaceStorage.save(workspaceTitle)}
      >
        Save
      </button>
      <button onClick={() => setShowLoadModal((prev) => !prev)}>Load</button>
      <div className="form-control">
        <label className="label cursor-pointer flex flex-col-reverse">
          <span className="label-text text-xs pt-0.5">auto-save</span>
          <input
            disabled={true} //TODO: autosave disabled until we add in a singluar place to read workspace data, so we can call save() without needing the workspace title/id
            type="checkbox"
            className="toggle toggle-success toggle-sm"
            checked={workspaceStorage.autoSave}
            onChange={(e) => workspaceStorage.setAutoSave(e.target.checked)}
          />
        </label>
      </div>

      {showLoadModal && (
        <LoadWorkspaceModal
          show={showLoadModal}
          onClose={() => setShowLoadModal(false)}
          workspaceList={workspaceStorage.getWorkspaceList()}
          loadWorkspace={loadWorkspace}
        />
      )}
    </div>
  );
}

function LoadWorkspaceModal(props: {
  show: boolean;
  onClose: () => void;
  workspaceList: WorkspaceData[];
  loadWorkspace: (title: string) => void;
}) {
  const { show } = props;
  const modalId = "workspaceLoadModal";

  useEffect(() => {
    if (document) {
      const modal = document.getElementById(modalId) as HTMLFormElement;
      show ? modal.showModal() : modal.close();
    }
  }, [show]);

  return (
    <dialog id={modalId} className="modal" onClose={props.onClose}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Load Workspace</h3>
        <ul className="menu">
          {props.workspaceList.map((item, index) => (
            <li
              key={index}
              onClick={() => {
                props.loadWorkspace(item.title);
                props.onClose();
              }}
            >
              <a>{item.title}</a>
            </li>
          ))}
        </ul>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
