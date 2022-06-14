import {AuthPage} from "./pages/auth/AuthPage";
import {RegisterPage} from "./pages/auth/RegisterPage";
import {PageUser} from "./pages/roles/user/PageUser";
import {PageSupervisor} from "./pages/roles/supervisor/PageSupervisor";
import React from "react";

export const appRoutes = {
    'auth':[
        {
            path: '/',
            element: <AuthPage />,
        },
        {
            path: '/register',
            element: <RegisterPage />,
        }
    ],
    'supervisor':[
        {
            path: '/supervisor',
            element: <PageSupervisor />,
        }
    ],
    'user':[
        {
            path: '/user',
            element: <PageUser />,
        }
    ]};