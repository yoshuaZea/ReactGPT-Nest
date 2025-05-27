import { createBrowserRouter, Navigate } from "react-router-dom";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { menuRoutes } from './routes';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      ...menuRoutes.map(route => ({
        path: route.to,
        element: route.component,
      })),
      {
        path: '',
        element: <Navigate to={menuRoutes[0].to} />
      }
    ],
  }
])