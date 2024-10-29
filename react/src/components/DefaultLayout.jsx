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
} from "./ui/dropdown-menu.jsx";
import { LogOut, Menu, X } from "lucide-react";

export default function DefaultLayout() {
  const { user, token, setUser, setToken, notification } = useStateContext();
  const [darkMode, setDarkMode] = useState("dark");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!token) return;

    axiosClient.get("/user").then(({ data }) => {
      setUser(data);
    });
  }, [token]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode === "dark");
  }, [darkMode]);

  const onLogout = (ev) => {
    ev.preventDefault();
    
    axiosClient.post("/logout").then(() => {
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
        <div id="defaultLayout" className="flex min-h-screen relative z-1">
          {/* Sidebar */}
          <aside
            className={`w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${
              menuOpen ? "translate-x-0" : "-translate-x-full"
            } transition-transform duration-200 ease-in-out sm:relative sm:translate-x-0 sm:block flex flex-col bg-white dark:bg-gray-800 z-20`}
          >
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <button className="sm:hidden" onClick={toggleMenu}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex flex-col space-y-4 flex-grow items-center">
              <Link to="/row" className="hover:underline">
                Row Items
              </Link>
              {(user.role === "owner" || user.role === "admin") && (
                <>
                  <Link to="/science" className="hover:underline">
                    Data Science Lecturers
                  </Link>
                  <Link to="/log" className="hover:underline">
                    Log
                  </Link>
                  <Link to="/money" className="hover:underline">
                    Money
                  </Link>
                  <Link to="/work" className="hover:underline">
                    Work
                  </Link>
                </>
              )}
              <div className="flex flex-col items-start mt-auto space-y-4">
                <div className="flex items-center space-x-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center p-2 rounded-md">
                      Theme
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuRadioGroup
                        value={darkMode}
                        onValueChange={setDarkMode}
                      >
                        <DropdownMenuRadioItem value="dark">
                          Dark Mode
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="light">
                          Light Mode
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <span>{user.name}</span>
                <div className="items-end">
                  <LogOut
                    size={40}
                    color="#df2626"
                    strokeWidth={2.5}
                    className="cursor-pointer hover:text-red-800"
                    onClick={onLogout}
                  />
                </div>
              </div>
            </nav>
          </aside>

          {/* Backdrop for mobile menu */}
          {menuOpen && (
            <div
              className="fixed inset-0 bg-black opacity-50 "
              onClick={toggleMenu} // Close the menu when clicking outside
            />
          )}

          {/* Main Content */}
          <div className="flex-1 p-4 bg-gray-100 dark:bg-gray-900">
            <header className="flex justify-between items-center">
              <Link to="/dashboard" className="hover:underline hidden sm:block">
                Dashboard
              </Link>
              <button className="sm:hidden p-2" onClick={toggleMenu}>
                {menuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </header>

            <main className="mt-4">
              <Outlet />
            </main>

            {notification && (
              <div className="fixed bottom-4 right-4 p-4 bg-gray-800 text-white rounded-lg shadow-lg">
                {notification}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
