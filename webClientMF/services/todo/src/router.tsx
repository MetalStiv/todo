import {createBrowserRouter} from "react-router-dom";
import App from "./components/App";

const routes = [
    {
        path: "/todo",
        element: <App />,
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