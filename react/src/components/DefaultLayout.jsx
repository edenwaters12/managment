import { Link, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import axiosClient from "../axios-client.js";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
} from "./ui/dropdown-menu.jsx"; // Adjust the path as necessary

export default function DefaultLayout() {
  const { user, token, setUser, setToken, notification } = useStateContext();
  const [darkMode, setDarkMode] = useState('dark'); // Default dark mode

  useEffect(() => {
    if (!token) return;

    axiosClient.get('/user')
      .then(({ data }) => {
        setUser(data);
      });
  }, [token]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode === 'dark');
  }, [darkMode]);

  const onLogout = ev => {
    ev.preventDefault();

    axiosClient.post('/logout')
      .then(() => {
        setUser({});
        setToken(null);
      });
  };

  // Now place the Navigate component within the render return statement
  return (
    <>
      {!token ? (
        <Navigate to="/login" />
      ) : (
        <div id="defaultLayout" className="flex flex-col min-h-screen">
          <header className="flex flex-wrap justify-between items-center p-4 bg-gray-800 text-white">
            <div className="flex space-x-4 mb-2 sm:mb-0">
              <Link to="/dashboard" className="hover:underline">Dashboard</Link>
              <Link to="/science" className="hover:underline">Data science lecturers</Link>
              <Link to="/money" className="hover:underline">Money</Link>
              <Link to="/work" className="hover:underline">work</Link>
            </div>
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center p-2 bg-gray-700 rounded-md hover:bg-gray-600">
                  Theme
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuRadioGroup value={darkMode} onValueChange={setDarkMode}>
                    <DropdownMenuLabel>Select Theme:</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioItem value="dark">Dark Mode</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="light">Light Mode</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <span>{user.name}</span>
              <a onClick={onLogout} className="btn-logout hover:underline" href="#">Logout</a>
            </div>
          </header>
          <main className="flex-1 p-4 bg-gray-100 dark:bg-gray-900">
            <Outlet />
          </main>
          {notification &&
            <div className="fixed bottom-4 right-4 p-4 bg-gray-800 text-white rounded-lg shadow-lg">
              {notification}
            </div>
          }
        </div>
      )}
    </>
  );
}
