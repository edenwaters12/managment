import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/Input.jsx";
import { Button } from "@/components/ui/Button.jsx";
import { Card } from "@/components/ui/Card.jsx";
import { Alert } from "@/components/ui/Alert.jsx";
import Loader from "@/components/ui/Loader.jsx";

import { Textarea } from "@/components/ui/textarea.jsx";

export default function MoneyManagementForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    givemoney: '',
    dateTime: getTodayDate(), // Set default date to today
    description: '', // Added description field
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);


  const onSubmit = (ev) => {
    ev.preventDefault();
    setLoading(true);

    // Replace this with actual API request logic
    const request = axiosClient.post('/money-management', formData);

    request
      .then(() => {
        setNotification(`Data was successfully saved`);
        navigate('/money-management');
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
      <Card className="w-full max-w-md p-8 bg-white dark:bg-gray-800 text-black dark:text-white">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Hello 
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
              value={formData.title}
              onChange={ev => setFormData(prevForm => ({ ...prevForm, title: ev.target.value }))}
              placeholder="Title"
              required
              className="w-full"
            />
            <Input
              type="number"
              value={formData.givemoney}
              onChange={ev => setFormData(prevForm => ({ ...prevForm, givemoney: ev.target.value }))}
              placeholder="Givemoney"
              required
              className="w-full"
            />
                        <Textarea
              value={formData.description}
              onChange={ev => setFormData(prevForm => ({ ...prevForm, description: ev.target.value }))}
              placeholder="Description"
              rows="4"
              className="w-full p-2 border"
            />
            <Input
              type="date"
              value={formData.dateTime}
              onChange={ev => setFormData(prevForm => ({ ...prevForm, dateTime: ev.target.value }))}
              required
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

// Helper function to get today's date in YYYY-MM-DD format
function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
