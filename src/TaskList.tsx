import React, { useState , useEffect } from "react";
import { FaCheck, FaPlus, FaTrash, FaUndo } from "react-icons/fa";
import { json } from "stream/consumers";

interface Task {
  id: number;
  title: string;
  completed: boolean; // ✅ lowercase
}

const TaskList: React.FC = () => {
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Build Project", completed: false },
    { id: 2, title: "Learn React", completed: false },
  ]);

  useEffect ( () => {
    const savedTasks = localStorage.getItem("tasks");
    if(savedTasks){
        setTasks(JSON.parse(savedTasks))
    }
  },[]);

  useEffect (() => {
    localStorage.setItem("tasks",JSON.stringify(tasks))
  },[tasks])

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

  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div>
      <h2>My Task List</h2>
      <input
        type="text"
        placeholder="Enter new Task"
        value={newTaskTitle}
        onChange={(e) => setNewTaskTitle(e.target.value)}
      />
      <button style={{ marginLeft: "10px" }} onClick={addTask}>
        <FaPlus /> Add
      </button>

      <h2>Pending Tasks</h2>
      <ul>
        {pendingTasks.map(task => (
          <li key={task.id}>
            <span>{task.title}</span>
            <button style={{ marginLeft: "10px", color: "green" }} onClick={() => toggleTask(task.id)}>
              <FaCheck /> Complete
            </button>
            <button style={{ marginLeft: "10px", color: "red" }} onClick={() => deleteTask(task.id)}>
              <FaTrash /> Delete
            </button>
          </li>
        ))}
      </ul>

      <h2>Completed Tasks</h2>
      <ul>
        {completedTasks.map(task => (
          <li key={task.id} style={{ textDecoration: "line-through", color: "grey" }}>
            <span>{task.title}</span>
            <button style={{ marginLeft: "10px", color: "orange" }} onClick={() => toggleTask(task.id)}>
              <FaUndo /> Undo
            </button>
            <button style={{ marginLeft: "10px", color: "red" }} onClick={() => deleteTask(task.id)}>
              <FaTrash /> Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
