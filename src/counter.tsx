import React,{useState} from "react";


interface CounterProps {
    initialValue?: number;
}
const Counter:React.FC<CounterProps> = ({initialValue = 0}) => {
    const [count,setCount] = useState<number>(initialValue);


    return(
        <div>
            <h2>Counter Example</h2>
            <p>Count : {count}</p>
            <button onClick={() => setCount(count +1)}>Increment</button>
            <button onClick={() => setCount(count -1)}>Decrement</button>
            <button onClick={() => setCount(initialValue)}>Reset</button>
        </div>
    )
}

export default Counter