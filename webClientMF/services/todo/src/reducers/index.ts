import { combineReducers } from "redux";
import { configureStore } from '@reduxjs/toolkit'
import reposReducer from "./reposReducer";
import thunk from 'redux-thunk';

const rootReducer = combineReducers({
    repos: reposReducer
})

const store = configureStore({
    reducer: rootReducer
});

export default store;