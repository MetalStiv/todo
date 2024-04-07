import React from 'react';
import * as styles from './App.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { ADD_TODO } from '../reducers/reposReducer';
import { TodoState } from 'src/router';

const App = () => {
    const dispatch = useDispatch();
    const todos: string[] = useSelector((state: TodoState) => state.repos.todos);

    return (        
        <div className={styles.example}>
            <ul>
            {
                todos.map(todo => <li>{todo}</li>)
            }
            </ul>
            <button onClick={() => dispatch({type: ADD_TODO, payload: 'new Todo'})}>Add</button>
        </div>
    )
}

export default App;