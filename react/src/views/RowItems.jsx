import { useState, useEffect, useMemo } from "react";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import axiosClient from "../axios-client.js";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select.jsx";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Loader from "@/components/ui/loader";
import { useStateContext } from "@/context/ContextProvider.jsx";
import {
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import { AlertDialogDemo } from "../components/AlertDialogDemo.jsx";
import { Input } from "@/components/ui/input.jsx";

export default function RowItemShow() {
  const { user, setNotification } = useStateContext();
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  useEffect(() => {
    if (!["owner", "admin", "cdmiadmin","cdmi",'visiter'].includes(user.role)) {
      console.log(user.role)
      navigate("/404");
    }
  }, [user, navigate]);



  const getTodos = () => {
    setLoading(true);
    axiosClient
      .get(`/rows${category !== "all" ? `?category=${category}` : ""}`)
      .then((response) => {
        setTodos(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching todos", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    getTodos();
  }, [category]);

  const onDeleteClick = (todo) => {
    setSelectedTodo(todo);
    setIsAlertOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedTodo) {
      axiosClient
        .delete(`/row/${selectedTodo.id}`)
        .then(() => {
          setNotification("row was successfully deleted");
          getTodos();
        })
        .catch((e) => {
          console.log(e);
          setNotification("Error deleting todo", e);
        });
    }
    setIsAlertOpen(false);
    setSelectedTodo(null);
  };

  const columnHelper = createColumnHelper();

  const columns = useMemo(
    () => [
      columnHelper.accessor("title", {
        header: "Title",
        cell: (info) => info.getValue(),
      }),

      columnHelper.accessor("description", {
        header: "Description",
        cell: (info) =>
          info.getValue()
            ? info.getValue().length > 25
              ? `${info.getValue().substring(0, 25)}...`
              : info.getValue()
            : " ",
      }),
      columnHelper.accessor("author", {
        header: "Author",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("files", {
        header: "Files",
        cell: (info) => {
          const files = JSON.parse(info.getValue() || "[]");
          return files.length > 0 ? (
            files.map((file, index) => (
              <Link
                key={index}
                to={`${import.meta.env.VITE_API_DOWNLOAD_URL}/storage/${file}`}
                className="text-blue-500 hover:underline"
                target="_blank"                
              >
                View File {index + 1}
              </Link>
            ))
          ) : (
            "No files"
          );
        },
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) =>
          (user.role === "owner" || user.role === "admin") ? (
            <>
              <Link
                to={`/row/${row.original.id}`}
                className="text-blue-500 hover:underline"
              >
                Show
              </Link>
              <Button
                className="ml-4   hover:bg-red-600"
                onClick={() => onDeleteClick(row.original)}
              >
                Delete
              </Button>
            </>
          ) : (
            <Link
            to={`/row/${row.original.id}`}
            className="text-blue-500 hover:underline"
          >
            Show
          </Link>
          )
      }),
    ],
    [user]
  );

  const filteredTodos = useMemo(() => {
    return todos.filter(
      (todo) =>
        (todo.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (todo.description?.toLowerCase() || "").includes(
          searchQuery.toLowerCase()
        )
    );
  }, [todos, searchQuery]);

  const table = useReactTable({
    data: filteredTodos,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="p-4 mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h1
          className="text-2xl font-semibold cursor-pointer"
          onClick={() => setSearchQuery("")}
        >
          Row Items
        </h1>
        <div className="flex flex-col sm:flex-row sm:items-center w-full sm:w-auto sm:space-x-4">
          <Input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="py-2 px-4 rounded-md focus:outline-none focus:ring-2 sm:order-2 z-50 xl:w-[200px]"
          />
          <Button
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:order-2 z-50 xl:w-[100px]"
            onClick={() => navigate("/row/new")}
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
          ) : filteredTodos.length > 0 ? (
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="cursor-pointer">
                        {header.isPlaceholder ? null : (
                          <div
                            {...{
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: " 🔼 ",
                              desc: " 🔽 ",
                            }[header.column.getIsSorted()] ?? null}
                          </div>
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No rows found.
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
