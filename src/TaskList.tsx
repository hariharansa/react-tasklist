import React, { useReducer, useEffect } from "react";
import {
  FaCheck,
  FaPlus,
  FaTrash,
  FaUndo,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import "./TaskList.css";

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

interface State {
  tasks: Task[];
  editingTaskId: number | null;
  editingTitle: string;
  newTaskTitle: string;
}

type Action =
  | { type: "ADD_TASK" }
  | { type: "DELETE_TASK"; payload: { id: number } }
  | { type: "TOGGLE_TASK"; payload: { id: number } }
  | { type: "START_EDIT"; payload: { id: number } }
  | { type: "CHANGE_EDIT_TITLE"; payload: { title: string } }
  | { type: "SAVE_EDIT"; payload: { id: number } }
  | { type: "CANCEL_EDIT" }
  | { type: "LOAD_TASKS"; payload: Task[] }
  | { type: "CLEAR_ALL" }
  | { type: "CHANGE_NEW_TASK"; payload: { title: string } };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "CHANGE_NEW_TASK":
      return { ...state, newTaskTitle: action.payload.title };

    case "ADD_TASK":
      if (!state.newTaskTitle.trim()) return state; // avoid empty task
      return {
        ...state,
        tasks: [
          ...state.tasks,
          { id: Date.now(), title: state.newTaskTitle, completed: false },
        ],
        newTaskTitle: "", // reset input
      };

    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload.id),
      };

    case "TOGGLE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id
            ? { ...task, completed: !task.completed }
            : task
        ),
      };

    case "START_EDIT":
      const editTask = state.tasks.find(
        (task) => task.id === action.payload.id
      );
      return {
        ...state,
        editingTaskId: action.payload.id,
        editingTitle: editTask ? editTask.title : "",
      };

    case "CHANGE_EDIT_TITLE":
      return { ...state, editingTitle: action.payload.title };

    case "SAVE_EDIT":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id
            ? { ...task, title: state.editingTitle }
            : task
        ),
        editingTaskId: null,
        editingTitle: "",
      };

    case "CANCEL_EDIT":
      return { ...state, editingTaskId: null, editingTitle: "" };

    case "LOAD_TASKS":
      return { ...state, tasks: action.payload };

    case "CLEAR_ALL":
      return { ...state, tasks: [], editingTaskId: null, editingTitle: "" };

    default:
      return state;
  }
};

const TaskList: React.FC = () => {
  const initialState: State = {
    tasks: [],
    editingTaskId: null,
    editingTitle: "",
    newTaskTitle: "",
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  // ✅ Load from localStorage once
  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) {
      dispatch({ type: "LOAD_TASKS", payload: JSON.parse(saved) });
    }
  }, []);

  // ✅ Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(state.tasks));
  }, [state.tasks]);

  const saveTask = (id: number) => {
    dispatch({ type: "SAVE_EDIT", payload: { id } });
  };

  const cancelEdit = () => {
    dispatch({ type: "CANCEL_EDIT" });
  };

  const pendingTasks = state.tasks.filter((task) => !task.completed);
  const completedTasks = state.tasks.filter((task) => task.completed);

  return (
    <div className="task-container">
      <h2>My Task List</h2>

      {/* Input for new task */}
      <div className="task-input-row">
        <input
          className="task-input"
          type="text"
          placeholder="Enter new task"
          value={state.newTaskTitle}
          onChange={(e) =>
            dispatch({
              type: "CHANGE_NEW_TASK",
              payload: { title: e.target.value },
            })
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") dispatch({ type: "ADD_TASK" });
          }}
        />
        <button
          className="btn-add"
          style={{ marginLeft: "10px" }}
          onClick={() => dispatch({ type: "ADD_TASK" })}
        >
          <FaPlus /> Add
        </button>
        <button
          className="btn-clear"
          style={{ marginLeft: "10px", backgroundColor: "red", color: "white" }}
          onClick={() => {
            if (window.confirm("Are you sure you want to delete all tasks?")) {
              dispatch({ type: "CLEAR_ALL" });
              localStorage.removeItem("tasks");
            }
          }}
        >
          Clear All
        </button>
      </div>

      {/* Pending Tasks */}
      <h2>Pending Tasks</h2>
      <ul className="task-list">
        {pendingTasks.map((task) => (
          <li key={task.id} className="task-item">
            <div className="task-content">
              {state.editingTaskId === task.id ? (
                <input
                  className="edit-input"
                  type="text"
                  value={state.editingTitle}
                  onChange={(e) =>
                    dispatch({
                      type: "CHANGE_EDIT_TITLE",
                      payload: { title: e.target.value },
                    })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveTask(task.id);
                  }}
                />
              ) : (
                <span className="task-title">{task.title}</span>
              )}
            </div>
            <div className="task-actions">
              {state.editingTaskId === task.id ? (
                <>
                  <button
                    className="btn btn-save"
                    onClick={() => saveTask(task.id)}
                  >
                    <FaSave /> Save
                  </button>
                  <button className="btn btn-cancel" onClick={cancelEdit}>
                    <FaTimes /> Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn btn-complete"
                    onClick={() =>
                      dispatch({ type: "TOGGLE_TASK", payload: { id: task.id } })
                    }
                  >
                    <FaCheck /> Complete
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() =>
                      dispatch({
                        type: "DELETE_TASK",
                        payload: { id: task.id },
                      })
                    }
                  >
                    <FaTrash /> Delete
                  </button>
                  <button
                    className="btn btn-edit"
                    onClick={() =>
                      dispatch({ type: "START_EDIT", payload: { id: task.id } })
                    }
                  >
                    <FaEdit /> Edit
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* Completed Tasks */}
      <h2>Completed Tasks</h2>
      <ul className="task-list">
        {completedTasks.map((task) => (
          <li key={task.id} className="task-item">
            <div className="task-content">
              {state.editingTaskId === task.id ? (
                <input
                  type="text"
                  value={state.editingTitle}
                  onChange={(e) =>
                    dispatch({
                      type: "CHANGE_EDIT_TITLE",
                      payload: { title: e.target.value },
                    })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveTask(task.id);
                  }}
                />
              ) : (
                <span className="task-title task-completed-title">
                  {task.title}
                </span>
              )}
            </div>
            <div className="task-actions">
              {state.editingTaskId === task.id ? (
                <>
                  <button
                    className="btn btn-save"
                    onClick={() => saveTask(task.id)}
                  >
                    <FaSave /> Save
                  </button>
                  <button className="btn btn-cancel" onClick={cancelEdit}>
                    <FaTimes /> Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn btn-undo"
                    onClick={() =>
                      dispatch({ type: "TOGGLE_TASK", payload: { id: task.id } })
                    }
                  >
                    <FaUndo /> Undo
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() =>
                      dispatch({
                        type: "DELETE_TASK",
                        payload: { id: task.id },
                      })
                    }
                  >
                    <FaTrash /> Delete
                  </button>
                  <button
                    className="btn btn-edit"
                    onClick={() =>
                      dispatch({ type: "START_EDIT", payload: { id: task.id } })
                    }
                  >
                    <FaEdit /> Edit
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
