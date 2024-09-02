import { useState, useEffect } from "react";
import axiosClient from "../axios-client.js";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select.jsx";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Loader from "@/components/ui/loader"; // Import your Loader component
import { useStateContext } from "@/context/ContextProvider.jsx";
import { AlertDialogDemo } from "../components/AlertDialogDemo.jsx";
import { Table, TableHeader, TableBody, TableCell, TableRow } from "@/components/ui/table"; // Import Shadcn Table components

export default function TodosPage() {
  const [todos, setTodos] = useState([]);
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, setNotification } = useStateContext();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

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

  const onDeleteClick = (todo) => {
    setSelectedUser(todo);
    setIsAlertOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedUser) {
      axiosClient.delete(`/todos/${selectedUser.id}`)
        .then(() => {
          setNotification('Todo was successfully deleted');
          getTodo();
        })
        .catch((e) => {
          console.log(e);
          setNotification('Error deleting todo', e);
        });
    }
    setIsAlertOpen(false);
    setSelectedUser(null);
  };
  return (
    <div className="p-4 mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Data Science Lecturers</h1>
        <div className="flex flex-col sm:flex-row sm:items-center w-full sm:w-auto sm:space-x-4">
          {/* Category dropdown */}
          <div className="w-full sm:w-1/2 z-40 mb-4 sm:mb-0 sm:order-1 mr-6">
            <Select
              value={category}
              onValueChange={(value) => setCategory(value)}
              className="mt-1 block w-full"
            >
              <SelectTrigger  className="xl:w-[150px]">
                <span>{category || "---select---"}</span>
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
          
          {/* Create button */}
          <Button
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:order-2 z-50 xl:w-[100px]"
            onClick={() => navigate("/science/new")}
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Topic</TableCell>
                  <TableCell className="hidden md:table-cell">Description</TableCell>
                  {user.name === `${import.meta.env.VITE_ADMIN}` && (
                    <TableCell>Actions</TableCell>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {todos.map(todo => (
                  <TableRow key={todo.id}>
                    <TableCell>{todo.today_date}</TableCell>
                    <TableCell>{todo.category.toUpperCase()}</TableCell>
                    <TableCell>{todo.title}</TableCell>
                    <TableCell>{todo.topic}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {todo.description ? (todo.description.length > 20 ? `${todo.description.substring(0, 35)}...` : todo.description) : ' '}
                    </TableCell>
                    {user.name === `${import.meta.env.VITE_ADMIN}` && (
                      <TableCell>
                        <Link to={`/science/${todo.id}`} className="text-blue-500 hover:underline">Show</Link>
                        <Button
                          className="ml-4 bg-red-500 text-white hover:bg-red-600"
                          onClick={() => onDeleteClick(todo)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No found.
            </div>
          )}
        </Card>
        <AlertDialogDemo
          open={isAlertOpen}
          onClose={() => setIsAlertOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Confirm Deletion"
          description="Are you sure you want to delete this todo? This action cannot be undone."
        />
      </div>
    </div>
  );
}
