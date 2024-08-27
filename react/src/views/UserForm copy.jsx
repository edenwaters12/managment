import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../context/ContextProvider.jsx";
import Input from "@/components/ui/Input.jsx";
import Button from "@/components/ui/Button.jsx";
import Card from "@/components/ui/Card.jsx";
import Alert from "@/components/ui/Alert.jsx";
import Loader from "@/components/ui/Loader.jsx";
import Switch from "@/components/ui/Switch.jsx"; // Adjust based on actual path

export default function UserForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState({
    id: null,
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // Manage dark mode state
  const { setNotification } = useStateContext();

  useEffect(() => {
    if (id) {
      setLoading(true);
      axiosClient.get(`/users/${id}`)
        .then(({ data }) => {
          setLoading(false);
          setUser(data);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [id]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const onSubmit = (ev) => {
    ev.preventDefault();
    setLoading(true);

    const request = user.id
      ? axiosClient.put(`/users/${user.id}`, user)
      : axiosClient.post('/users', user);

    request
      .then(() => {
        setNotification(`User was successfully ${user.id ? 'updated' : 'created'}`);
        navigate('/users');
      })
      .catch(err => {
        setLoading(false);
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
      });
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
      <div className="flex items-center mb-4">
        <Switch
          checked={darkMode}
          onChange={() => setDarkMode(prev => !prev)}
          className="mr-2"
        />
        <span className="text-gray-800 dark:text-gray-200">
          Toggle Dark Mode
        </span>
      </div>
      <Card className="w-full max-w-md p-8 bg-white dark:bg-gray-800 text-black dark:text-white">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          {user.id ? `Update User: ${user.name}` : 'New User'}
        </h1>
        {loading && <Loader />}
        {errors && Object.keys(errors).length > 0 && (
          <Alert variant="error" className="mb-4">
            {Object.keys(errors).map(key => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </Alert>
        )}
        {!loading && (
          <form onSubmit={onSubmit} className="space-y-4">
            <Input
              type="text"
              value={user.name}
              onChange={ev => setUser(prevUser => ({ ...prevUser, name: ev.target.value }))}
              placeholder="Name"
              required
              className="w-full"
            />
            <Input
              type="email"
              value={user.email}
              onChange={ev => setUser(prevUser => ({ ...prevUser, email: ev.target.value }))}
              placeholder="Email"
              required
              className="w-full"
            />
            <Input
              type="password"
              value={user.password}
              onChange={ev => setUser(prevUser => ({ ...prevUser, password: ev.target.value }))}
              placeholder="Password"
              required={!user.id}
              className="w-full"
            />
            <Input
              type="password"
              value={user.password_confirmation}
              onChange={ev => setUser(prevUser => ({ ...prevUser, password_confirmation: ev.target.value }))}
              placeholder="Password Confirmation"
              required={!user.id}
              className="w-full"
            />
            <Button type="submit" className="w-full bg-blue-500 text-white hover:bg-blue-600">
              Save
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
