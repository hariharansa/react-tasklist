import React from 'react';
import Hello from './Hello';
import Counter from './counter';
import TaskList from './TaskList';

const App:React.FC = () => {
    return (
        <div style={{padding:"20px"}}>
            <Hello name = 'Hariharan' />
            <Counter initialValue={0}/>
            <Counter initialValue={10} />
            <TaskList />
        </div>

        
    )
}

export default App