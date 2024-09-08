import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../context/ContextProvider.jsx";
import { Input } from "@/components/ui/Input.jsx";
import { Button } from "@/components/ui/Button.jsx";
import { Card } from "@/components/ui/Card.jsx";
import Loader from "@/components/ui/Loader.jsx";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select.jsx";

export default function UserForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState({
    id: null,
    name: "",
    username: "",
    role: "null",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState({});
  const [category, setCategory] = useState('null');
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();

  useEffect(() => {
    if (id) {
      setLoading(true);
      axiosClient
        .get(`/users/${id}`)
        .then(({ data }) => {
          setLoading(false);
          setUser(data);
          setCategory(data.role);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [id]);

  useEffect(() => {
    // Always apply dark mode
    document.documentElement.classList.add("dark");
  }, []);

  const onSubmit = (ev) => {
    ev.preventDefault();
    setLoading(true);

    const updatedUser = { ...user, role: category };

    const request = user.id
      ? axiosClient.put(`/users/${user.id}`, updatedUser)
      : axiosClient.post("/users", updatedUser);

    request
      .then(() => {
        setNotification(
          `User was successfully ${user.id ? "updated" : "created"}`
        );
        navigate("/users");
      })
      .catch((err) => {
        setLoading(false);
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
      });
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md p-8 bg-white dark:bg-gray-800 text-black dark:text-white">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          {user.id ? `Update User: ${user.name}` : "New User"}
        </h1>
        {loading && <Loader />}
        {errors && Object.keys(errors).length > 0 && (
          <div className="mb-4 p-4 border border-red-500 text-red-500 rounded">
            {Object.keys(errors).map((key) => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        )}
        {!loading && (
          <form onSubmit={onSubmit} className="space-y-4">
            <Input
              type="text"
              value={user.name}
              onChange={(ev) =>
                setUser((prevUser) => ({ ...prevUser, name: ev.target.value }))
              }
              placeholder="Name"
              required
              className="w-full"
            />
            <Input
              type="text"
              value={user.username}
              onChange={(ev) =>
                setUser((prevUser) => ({
                  ...prevUser,
                  username: ev.target.value,
                }))
              }
              placeholder="Username"
              required
              className="w-full"
            />
            <Select   
              value={category}
              onValueChange={(value) => setCategory(value)}
              className="mt-1 block w-full"
            >
              <SelectTrigger>
                <span>{category || "---select---"}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="owner">owner</SelectItem>
                <SelectItem value="admin">admin</SelectItem>
                <SelectItem value="cdmiadmin">cdmiadmin</SelectItem>
                <SelectItem value="cdmi">cdmi</SelectItem>
                <SelectItem value="visitor">visitor</SelectItem>
                <SelectItem value="null">null</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="email"
              value={user.email}
              onChange={(ev) =>
                setUser((prevUser) => ({ ...prevUser, email: ev.target.value }))
              }
              placeholder="Email"
              required
              className="w-full"
            />
            <Input
              type="password"
              value={user.password}
              onChange={(ev) =>
                setUser((prevUser) => ({
                  ...prevUser,
                  password: ev.target.value,
                }))
              }
              placeholder="Password"
              required={!user.id}
              className="w-full"
            />
            <Input
              type="password"
              value={user.password_confirmation}
              onChange={(ev) =>
                setUser((prevUser) => ({
                  ...prevUser,
                  password_confirmation: ev.target.value,
                }))
              }
              placeholder="Password Confirmation"
              required={!user.id}
              className="w-full"
            />
            <Button
              type="submit"
              className="w-full bg-blue-500 text-white hover:bg-blue-600"
            >
              Save
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
