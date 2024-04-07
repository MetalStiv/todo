import React from 'react';
import * as styles from './App.module.scss';
import { Outlet } from 'react-router';
import { Link } from 'react-router-dom';

const App = () => {
    return (
        <React.Fragment>
            <div className={styles.example}>
                Todo App
            </div>
            {/* <Outlet /> */}
        </React.Fragment>
    )
}

export default App;