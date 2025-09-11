import React, { useState, useEffect } from "react";
import { FaCheck, FaPlus, FaTrash, FaUndo, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import "./TaskList.css"


interface Task {
  id: number;
  title: string;
  completed: boolean;
}

const TaskList: React.FC = () => {
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>(() => {
  const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved):[];
  });

  const [editingTaskId,setEditingTaskId] = useState<number | null>(null);
  const [editingTitle,setEditingTitle] = useState("");


  // ✅ Load from localStorage once on component mount
//   useEffect(() => {
//     const savedTasks = localStorage.getItem("tasks");
//     if (savedTasks) {
//       setTasks(JSON.parse(savedTasks));
//     }
//   }, []);

  // ✅ Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const addTask = () => {
    if (newTaskTitle.trim() === "") return;
    const newTask: Task = {
      id: tasks.length + 1,
      title: newTaskTitle,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
  };

  const clearAllTasks = () => {
    const confirmClear = window.confirm("Are You Sure want to delete all the tasks");
    if(confirmClear){
        setTasks([]);
        localStorage.removeItem("tasks")
    }
  }

  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  const saveTask = (id:number) => {
    setTasks(tasks.map(task => task.id === id ? {...task,title:editingTitle}:task))
    setEditingTitle("");
    setEditingTaskId(null);
  }

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditingTitle("");
  }

  return (
    <div className="task-container">
      <h2>My Task List</h2>
      <div className="task-input-row">
        <input
        className="task-input"
        type="text"
        placeholder="Enter new Task"
        value={newTaskTitle}
        onChange={(e) => setNewTaskTitle(e.target.value)}
      />
      <div className="task-list">
        <button className="btn-add" style={{ marginLeft: "10px" }} onClick={addTask}><FaPlus /> Add</button>
        <button className="btn-clear" style={{marginLeft:"10px",backgroundColor:"red",color:"white"}} onClick={clearAllTasks}>Clear All</button>
      </div>
      

      </div>
      
      <h2>Pending Tasks</h2>
      <ul className="task-list">
        {pendingTasks.map(task => (
          <li key={task.id} className="task-item">
                <div className="task-content">
                    {editingTaskId === task.id ? (
                            <input className="edit-input" type="text" value={editingTitle} onChange={(e) => setEditingTitle(e.target.value)}
                            onKeyDown={(e) => {if(e.key === "Enter") saveTask(task.id);}} />
                    ):(
                        <span className="task-title">{task.title}</span>   
                    )}
                </div>
                <div className="task-actions">
                    {editingTaskId === task.id ? (
                        <>
                        <button className="btn btn-save" onClick={() => saveTask(task.id)}><FaSave />save</button>
                        <button className="btn btn-cancel" onClick={cancelEdit}><FaTimes />Cancel</button>
                        </>
                    ):(
                        <>
                        <button className="btn btn-complete" style={{ marginLeft: "10px" }} onClick={() => toggleTask(task.id)}><FaCheck /> Complete </button>
                        <button className="btn btn-delete" style={{ marginLeft: "10px"}} onClick={() => deleteTask(task.id)}><FaTrash /> Delete </button>
                        <button className="btn btn-edit" style={{ marginLeft:"10px"}} onClick={() => {
                            setEditingTaskId(task.id);
                            setEditingTitle(task.title); }}>Edit</button>
                        </>
                    )}
                </div>
          </li>
        ))}
      </ul>

      <h2>Completed Tasks</h2>
      <ul>
        {completedTasks.map(task => (
          <li className="task-item" key={task.id}>
            <div className="task-content">
                {editingTaskId === task.id ? (
                    <input type="text" value={editingTitle} onChange={(e) => setEditingTitle(e.target.value)}
                    onKeyDown={(e) => { if(e.key === "Enter") saveTask(task.id)}} />
                ):(
                    <span className="task-title task-completed-title">{task.title}</span>
                )}
            </div>
            <div  className="task-actions">
                {
                    editingTaskId === task.id ?(
                        <>
                        <button className="btn btn-save" onClick={() => saveTask(task.id)}><FaSave /> Save</button>
                        <button className="btn btn-cancel" onClick={cancelEdit}><FaTimes />Cancel</button>
                        </>
                    ):(
                        <>
                        <button className="btn btn-undo" onClick={() => toggleTask(task.id)}> <FaUndo /> Undo</button>
                        <button className="btn btn-delete" onClick={() => deleteTask(task.id)}><FaTrash /> Delete</button>
                        <button className="btn btn-edit" onClick={() => {
                            setEditingTaskId(task.id);
                            setEditingTitle(task.title)
                        }}><FaEdit/>Edit</button>
                        </>
                    )
                }
            </div>
          </li>
        ))}
      </ul>
    </div> 
  );
};

export default TaskList;
