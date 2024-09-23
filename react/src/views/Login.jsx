// import {Link} from "react-router-dom";
import axiosClient from "../axios-client.js";
import { createRef, useEffect } from "react";
import { useStateContext } from "../context/ContextProvider.jsx";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button.jsx";

export default function Login() {
  const usernameRef = createRef();
  const passwordRef = createRef();
  const { setUser, setToken } = useStateContext();
  const [message, setMessage] = useState(null);
  const [data, setData] = useState("");

  // useEffect(() => {
  //   axiosClient.get('https://ipinfo.io/json?token=9b203c2cebb8bc')
  //     .then(({data}) => {
  //       console.log(data)
  //       setData(data)
  //     })
  // });

  const onSubmit = (ev) => {
    ev.preventDefault();
    
    axiosClient
      .get("https://ipinfo.io/json?token=9b203c2cebb8bc")
      .then(({ data }) => {
        setData(data);
        const payload = {
          username: usernameRef.current.value,
          password: passwordRef.current.value,
          data: data,
        };
        console.log(payload); // Log the correct object
        return axiosClient.post("/login", payload);
      })
      .then(({ data }) => {
        setUser(data.user);
        setToken(data.token);
      })
      .catch((err) => {
        // Handle the case where err.response might be undefined
        if (err.response) {
          const response = err.response;
          if (response.status === 422) {
            setMessage(response.data.message);
          } else {
            console.error("Server responded with an error:", response);
          }
        } else {
          console.error("An error occurred (no response from server):", err.message);
          alert("Network or server error. Please try again later.");
        }
      });
  };
  
  

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-[360px] relative z-10 bg-black max-w-[360px] p-8 shadow-sm">
        <form onSubmit={onSubmit}>
          <h1 className="text-lg mb-4 text-center">Login </h1>
          <Input
            ref={usernameRef}
            type="text"
            placeholder="Enter your username"
            className="block w-full mb-4 p-2 border rounded"
            name="username"
          />
          <Input
            ref={passwordRef}
            type="password"
            placeholder="Enter Password"
            className="block w-full mb-4 p-2 border rounded"
            name="password"
          />
          <Button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-sky-700">
            Login
          </Button>
          <br />
          {message && (
            <div className="mt-4 text-[#ae1212] text-base text-center">
              <p>{message}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
