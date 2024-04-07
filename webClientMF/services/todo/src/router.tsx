import {createBrowserRouter} from "react-router-dom";
import App from "./components/App";
import store from "./reducers";
import { Provider } from 'react-redux';

const routes = [
    {
        path: "/todo",
        element: <Provider store={store}>
                <App />
            </Provider>,
        // children: [
        //     {
        //         path: '/todo/sub',
        //         element:  <div>Todo sub</div>
        //     },
        // ]
    },
]

export const router = createBrowserRouter(routes);

export default routes;

export type TodoState = ReturnType<typeof store.getState>