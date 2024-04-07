import {createBrowserRouter} from "react-router-dom";
import LoginPage from "./pages/LoginPage";

const routes = [
    {
        path: "/login",
        element: <LoginPage />,
        // children: [
        //     {
        //         path: '/login/sub',
        //         element:  <div>Login sub</div>
        //     },
        // ]
    },
]

export const router = createBrowserRouter(routes);

export default routes;