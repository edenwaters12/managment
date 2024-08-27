import { useState, useEffect } from "react";
import axiosClient from "../axios-client.js";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select.jsx";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Loader from "@/components/ui/loader"; // Import your Loader component
import { useStateContext } from "@/context/ContextProvider.jsx";
import { AlertDialogDemo } from "../components/AlertDialogDemo.jsx";
// import { format } from 'date-fns'; // Import date-fns

export default function TodosPage() {
  const [todos, setTodos] = useState([]);
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user,setNotification } = useStateContext();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  // const formatDate = (date) => {
  //   return date ? format(new Date(date), 'MMMM dd, yyyy') : 'N/A';
  // };
  function getTodo() {
    axiosClient.get(`/todos${category !== "all" ? `?category=${category}` : ""}`)
      .then(response => {
        setTodos(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching todos", error);
        setLoading(false);
      });
  }

  useEffect(() => {
    setLoading(true);
    getTodo();
  }, [category]);

  const onDeleteClick = (user) => {
    setSelectedUser(user);
    setIsAlertOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedUser) {
      axiosClient.delete(`/todos/${selectedUser.id}`)
        .then(() => {
          setNotification('User was successfully deleted');
          getTodo();
        })
        .catch((e) => {
          console.log(e);
          setNotification('Error deleting user', e);
        });
    }
    setIsAlertOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Data science lecturers</h1>
        <div className="flex flex-col sm:flex-row sm:items-center w-full sm:w-auto">
          <div className="w-full sm:w-1/2 mb-4 sm:mb-0 sm:mr-4">
       <Select
              value={category}
              onValueChange={(value) => setCategory(value)}
              className="mt-1 block w-full"
            >
              <SelectTrigger>
                <span className="">{category || "---select---"}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="lecturer">Lecturer</SelectItem>
                <SelectItem value="public_holidays">Public Holidays</SelectItem>
                <SelectItem value="no_lecturer">No Lecturer</SelectItem>
                <SelectItem value="time_e">Time E</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => navigate("/todos/new")}
          >
            Create
          </Button>
        </div>
      </div>

      <div className="mt-8">
        <Card className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center p-4">
              <Loader /> 
            </div>
          ) : todos.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"> Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-w  ider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-w  ider">Topic</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                 
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"> {user.name == `${import.meta.env.VITE_ADMIN}` && (
                    "Actions"

                  )} </th>
                  
                  </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {todos.map(todo => (
                  <tr key={todo.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 dark:text-gray-100">{todo.today_date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 dark:text-gray-100">{todo.category.toUpperCase()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">{todo.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-400">{todo.topic}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{todo.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {user.name == `${import.meta.env.VITE_ADMIN}` && (
                        <>
                      <Link to={`/todos/${todo.id}`} className="text-blue-500 hover:underline">Edit</Link>
                        <Button
                        className="ml-4 bg-red-500 text-white hover:bg-red-600"
                        onClick={() => onDeleteClick(todo)}
                        >
                        Delete
                      </Button>
                          </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No todos found.
            </div>
          )}
        </Card>
        <AlertDialogDemo
          open={isAlertOpen}
          onClose={() => setIsAlertOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Confirm Deletion"
          description="Are you sure you want to delete this user? This action cannot be undone."
        />
      </div>
    </div>
  );
}
