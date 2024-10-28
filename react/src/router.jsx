import {createBrowserRouter, Navigate} from "react-router-dom";
import Dashboard from "./views/Dashboard.jsx";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import Login from "./views/Login";
import NotFound from "./views/NotFound";
import Signup from "./views/Signup";
import Users from "./views/Users";
import UserForm from "./views/UserForm";
import Todos from "./views/Todos.jsx";
import TodoForm from "./views/TodoForm.jsx";
import WorkShow from "./views/WorkShow.jsx";
import WorkForm from "./views/WorkForm.jsx";
import MoneyForm from "./views/MoneyForm.jsx";
import MoneyShow from "./views/MoneyShow.jsx";
import RowItemShow from "./views/RowItems.jsx";
import RowItemFrom from "./views/RowItemsFrom.jsx";
import Logpage from "./views/log.jsx";
import GooglePhotosViewer from "./views/GooglePhotosViewer.jsx";


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
      // data science leatucter details
      {
        path: '/science',
        element: <Todos/>
      },
      {
        path: '/science/:id/edit',
        element: <TodoForm key="Todoupdate"/>
      },
      {
        path: '/science/:id',
        element: <TodoForm key="showDetails"/>
      },
      {
        path: '/science/new',
        element: <TodoForm key="TodoCreate"/>
      },

      // Work Details
      {
        path: '/work',
        element: <WorkShow/>
      },
      {
        path: '/work/:id/edit',
        element: <WorkForm key="workUpdate"/>
      },
      {
        path: '/work/:id',
        element: <WorkForm key="workshow"/>
      },
      {
        path: '/work/new',
        element: <WorkForm key="workcrete"/>
      },
      {
        path: '/log',
        element: <Logpage key="log"/>
      },
      {
        path: '/log/:id',
        element: <Logpage key="log"/>
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
      // row items
      {
        path: '/row',
        element: <RowItemShow key="rowitems" />
      },
      {
        path: '/row/:id/edit',
        element: <RowItemFrom key="rowEdit"/>
      },
      {
        path: '/row/:id',
        element: <RowItemFrom key="rowDetail"/>
      },
      {
        path: '/row/new',
        element: <RowItemFrom key="rowCreate"/>
      },
      {
        path: "/google-photos",
        element: <GooglePhotosViewer />,
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
    path: "/google-image",
    element: <GooglePhotosViewer />,
  },
  {
    path: "/404",
    element: <NotFound />,
  },
  {
    path: "*",
    element: <NotFound/>
  }
])

export default router;
