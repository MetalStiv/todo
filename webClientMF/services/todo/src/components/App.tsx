import React from 'react';
import * as styles from './App.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { TodoState } from 'src/router';
import { ActionTypeEnum } from '../reducers/todosReducer';

const App = () => {
    const dispatch = useDispatch();
    const todos: string[] = useSelector((state: TodoState) => state.todos.todos);

    return (        
        <div className={styles.example}>
            <ul>
            {
                todos.map(todo => <li>{todo}</li>)
            }
            </ul>
            <button onClick={() => dispatch({type: ActionTypeEnum.ADD_TODO, payload: 'new Todo'})}>Add</button>
        </div>
    )
}

export default App;