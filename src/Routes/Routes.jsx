import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/MainLayout/Main";
import Login from "../Pages/Login/Login";
import Home from "../Pages/Home/Home";
import ProtectedRoute from "./ProtectedRoute";
import AddTask from "../Pages/AddTask/AddTask";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "/addTask",
        element: (
          <ProtectedRoute>
            <AddTask />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
