import { Link, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import axiosClient from "../axios-client.js";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioItem,
  DropdownMenuRadioGroup,
} from "./ui/dropdown-menu.jsx"; // Adjust the path as necessary
import { Menu, X } from "lucide-react"; // For icons

export default function DefaultLayout() {
  const { user, token, setUser, setToken, notification } = useStateContext();
  const [darkMode, setDarkMode] = useState('dark'); // Default dark mode
  const [menuOpen, setMenuOpen] = useState(false);

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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      {!token ? (
        <Navigate to="/login" />
      ) : (
        <div id="defaultLayout" className="flex flex-col min-h-screen">
          <header className="flex flex-wrap justify-between items-center p-4  ">
            <div className="flex justify-between w-full sm:w-auto  xl:gap-2 ">
              <div>
              <Link to="/dashboard" className="hover:underline">Dashboard</Link>
              </div>

              <Link onClick={onLogout} className="btn-logout hover:underline text-red-600 " >Logout</Link>

              <button className="sm:hidden p-2" onClick={toggleMenu}>
                {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
            <div className={`flex-col sm:flex-row sm:flex sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 ${menuOpen ? 'flex' : 'hidden'} sm:flex w-full sm:w-auto`}>
              <Link to="/row" className="hover:underline">Row Items</Link>
              { (user.role === 'owner' || user.role === 'admin') &&(<>
              <Link to="/science" className="hover:underline">Data Science Lecturers</Link>
              <Link to="/money" className="hover:underline">Money</Link>
              <Link to="/work" className="hover:underline">Work</Link>
              </>)}
              { (user.role === 'cdmiadmin' || user.role === 'cdmi') &&(<>
              <Link to="/science" className="hover:underline">Data Science Lecturers</Link>
              </>)}
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center p-2  rounded-md ">
                  Theme
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuRadioGroup value={darkMode} onValueChange={setDarkMode}>
                    <DropdownMenuRadioItem value="dark">Dark Mode</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="light">Light Mode</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <span>{user.name}</span>
            </div>
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
