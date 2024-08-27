import { useState, useEffect } from "react";
import axiosClient from "../axios-client.js";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/Input.jsx";
import { format } from 'date-fns';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select.jsx";
import { useNavigate,useParams } from "react-router-dom";


export default function TodoForm({ todo }) {
  const [title, setTitle] = useState(todo ? todo.title : "Django");
  const [description, setDescription] = useState(todo ? todo.description : "");
  const [todayDate, setTodayDate] = useState(todo ? todo.todayDate : "");
  const [startDate, setStartDate] = useState(todo ? todo.startDate : "13:00");
  const [endDate, setEndDate] = useState(todo ? todo.endDate : "14:00");
  const [category, setCategory] = useState(todo ? todo.category : "lecturer");
  const [topic, setTopic] = useState(todo ? todo.topic : "");
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setLoading(true);
      axiosClient.get(`/todos/${id}`)
        .then(({ data }) => {
          setLoading(false);
          setTitle(data.title || "")
          setDescription(data.description || "")
          setTodayDate(data.today_date || "")
          setStartDate(data.start_date || "")
          setEndDate(data.end_date || "")
          setCategory(data.category || "")
          setTopic(data.topic || "")   
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [id]);

  useEffect(() => {
    // Set default todayDate to current date if no todo is provided
    if (!todo) {
      const today = new Date().toISOString().split("T")[0];
      setTodayDate(today);
    }
  }, [todo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let todoData = {
      title,
      description,
      todayDate,
      startDate,
      endDate,
      category,
      topic,
    };
    // todoData.todayDate = todoData.todayDate.toDateString();
    // todoData.todayDate = format(todoData.todayDate, 'yyyy-MM-dd');


    // Determine endpoint and method based on whether we're creating or updating
    const endpoint = id ? `/todos/${id}` : "/todos";
    const method = id ? axiosClient.put : axiosClient.post;
    method(endpoint, todoData)
      .then(() => navigate("/todos"))
      .catch((error) => console.error(todo ? "Error updating todo" : "Error creating todo", error));
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <Select
            value={category}
            onValueChange={(value) => setCategory(value)}
            className="mt-1 block w-full"
          >
            <SelectTrigger>
              <span>{category || "---select---"}</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lecturer">Lecturer</SelectItem>
              <SelectItem value="public_holidays">Public Holidays</SelectItem>
              <SelectItem value="no_lecturer">No Lecturer</SelectItem>
              <SelectItem value="time_e">Time E</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {category === "lecturer" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <Select
              value={title}
              onValueChange={(value) => setTitle(value)}
              className="mt-1 block w-full"
            >
              <SelectTrigger>
                <span>{title || "---select---"}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="django">Django</SelectItem>
                <SelectItem value="numpy">Numpy</SelectItem>
                <SelectItem value="pandas">Pandas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Topic
          </label>
          <Input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1"
          />
        </div>

        {/* Conditionally render fields based on category */}
        {category === "lecturer" && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Start Time
              </label>
              <Input
                type="time"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                End Time
              </label>
              <Input
                type="time"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1"
              />
            </div>
          </>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Today Date
          </label>
          <Input
            type="date"
            value={todayDate}
            onChange={(e) => setTodayDate(e.target.value)}
            className="mt-1"
          />
        </div>

        <div className="flex space-x-4">
          <Button
            type="submit"
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            {todo ? "Update Todo" : "Create Todo"}
          </Button>
          <Button
            type="button"
            className="bg-gray-500 text-white hover:bg-gray-600"
            onClick={() => navigate("/todos")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
