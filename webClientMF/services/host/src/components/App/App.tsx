import React from 'react';
import * as styles from './App.module.scss';
import { Outlet } from 'react-router';
import { Link } from 'react-router-dom';

const App = () => {
    return (
        <React.Fragment>
            <Link to={'about'}>About</Link>
            <div className={styles.example}>
                Hello World!
            </div>
            <Outlet />
        </React.Fragment>
    )
}

export default App;