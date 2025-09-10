import React,{useState} from "react";
import {FaCheck,FaPlus,FaTrash,FaUndo} from "react-icons/fa"


interface Task{
    id:number,
    title:string,
    completed:Boolean,
}
const TaskList:React.FC = () => {
    const [showCompleted,setShowCompleted] = useState(true);
    const [newTaskTitle,setNewTaskTitle] = useState<string>("")
    const [tasks,setTasks] = useState<Task[]>([
        {
            id:1,title:'Build Project',completed:false
        },
        {   
            id:2,title:"Learn React",completed:false
        },
    ])

    const toggleTask = (id:number) => {
        setTasks(tasks.map(task => task.id !== id ? {...task,completed: !task.completed} : task ))
        
    }
    const deleteTask = (id:number) => {
        setTasks(tasks.filter(task => task.id !== id))
    }

    const pendingTasks = tasks.filter(task => !task.completed);
    const CompletedTasks = tasks.filter(task => task.completed)
    const addTask  = () => {
        if(newTaskTitle.trim() === "") return;
        const NewTask:Task = 
        {
            id:tasks.length+1,
            title:newTaskTitle,
            completed:false
        }
        setTasks([...tasks,NewTask])
        setNewTaskTitle("")
    }

    return(
        <div>
            <h2>My Tasks Lists</h2>
            <input type="text" placeholder="Enter new Task" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)}></input>
            <button style={{marginLeft:"10px"}} onClick={addTask}>{FaPlus({})}Add Button</button>
            <ul>{tasks.map(task =>
                <li key={task.id}><span style={{textDecoration : task.completed ? "line-through" : "none"}}>{task.title}</span>
                <button onClick={() => toggleTask(task.id)} style={{ marginLeft:"10px",color:"green"}}>{task.completed ? "undo" : "Complete"}</button>
                <button onClick={() => deleteTask(task.id)}  style={{ marginLeft: "10px", color: "red" }}>{FaTrash({})} Delete</button></li>
            )
                }
                
            </ul>


            <h2>Pending Tasks</h2>
            {}
            <ul>
                {pendingTasks.map(task => (
                    <li key={task.id}><span>{task.title}</span>
                    <button style={{marginLeft:"10px"}} onClick={() => toggleTask(task.id)}>complete</button>
                    <button style={{marginLeft:"10px"}} onClick={() => deleteTask(task.id)}>Delete</button>
                    </li>
                ))}
            </ul>


            <h2>Completed Tasks</h2>
            <ul>
                {CompletedTasks.map(task => (
                    <li key={task.id} style={{textDecoration:"line-through",color:"grey"}}><span>{task.title}</span>
                    <button onClick={() => toggleTask(task.id)}>undo</button>
                    <button onClick={() => deleteTask(task.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    )

};

export default TaskList