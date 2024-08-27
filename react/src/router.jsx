import {createBrowserRouter, Navigate} from "react-router-dom";
import Dashboard from "./Dashboard.jsx";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import Login from "./views/Login";
import NotFound from "./views/NotFound";
import Signup from "./views/Signup";
import Users from "./views/Users";
import UserForm from "./views/UserForm";
import Todos from "./views/Todos.jsx";
import TodoForm from "./views/TodoForm.jsx";
import MoneyForm from "./views/MoneyForm.jsx";
import MoneyShow from "./views/MoneyShow.jsx";


const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout/>,
    children: [
      {
        path: '/',
        element: <Navigate to="/dashboard"/>
      },
      {
        path: '/dashboard',
        element: <Dashboard/>
      },
      {
        path: '/users',
        element: <Users/>
      },
      {
        path: '/users/new',
        element: <UserForm key="userCreate" />
      },
      {
        path: '/users/:id',
        element: <UserForm key="userUpdate" />
      },

      {
        path: '/science',
        element: <Todos/>
      },
      {
        path: '/science/:id',
        element: <TodoForm key="Todoupdate"/>
      },
      {
        path: '/science/new',
        element: <TodoForm key="TodoCreate"/>
      },

      {
        path: '/money',
        element: <MoneyShow key="showmonery" />
      },
      {
        path: '/money/:id',
        element: <MoneyForm key="editmoney" />
      },
      {
        path: '/money/new',
        element: <MoneyForm key="editmoney" />
      },
    ]
  },
  {
    path: '/',
    element: <GuestLayout/>,
    children: [
      {
        path: '/login',
        element: <Login/>
      },
      {
        path: '/signup-dhruvishlathiya',
        element: <Signup/>
      }
    ]
  },
  {
    path: "*",
    element: <NotFound/>
  }
])

export default router;
