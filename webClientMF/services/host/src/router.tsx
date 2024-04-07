import {createBrowserRouter, Outlet} from "react-router-dom";
// @ts-ignore
import loginRoutes from 'login/Router';
// @ts-ignore
import todoRoutes from 'todo/Router';
import React from "react";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Outlet />,
        children: [
            ...loginRoutes,
            ...todoRoutes,
        ]
    },
]);