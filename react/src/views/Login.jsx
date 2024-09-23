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
  let payload;

  const onSubmit = (ev) => {
    ev.preventDefault();

    const userAgent = navigator.userAgent;
    let browserDetails = {}; // Initialize browserDetails variable

    // Check if userAgentData is available
    if ("userAgentData" in navigator) {
      navigator.userAgentData
        .getHighEntropyValues(["platform", "brands"])
        .then((data) => {
          // Populate browserDetails
          browserDetails = {
            platform: navigator.platform,
            language: navigator.language,
            online: navigator.onLine,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            cookiesEnabled: navigator.cookieEnabled,
            hardwareConcurrency: navigator.hardwareConcurrency,
            deviceMemory: navigator.deviceMemory,
            brands: data.brands.map((brand) => brand.brand).join(", "),
            mobile: /Mobi|Android/i.test(navigator.userAgent), // Check for mobile devices
          };

          // Proceed with the request to get IP information
          return axiosClient.get("/get-ipinfo");
        })
        .then(({ data }) => {
          // Add browser information to the data

          // Prepare payload for login
          const payload = {
            username: usernameRef.current.value,
            password: passwordRef.current.value,
            data: data, // IP info data with browser info
            more: browserDetails, // IP info data with browser info
          };

          // Send login request
          return axiosClient.post("/login", payload);
        })
        .then(({ data }) => {
          setUser(data.user);
          setToken(data.token);
        })
        .catch(async (err) => {
          console.error("Error during IP info request:", err);
          setMessage(`Error during IP info request: ${err}. Please try again.`);

          // Handle errors for the local request
          if (err.response) {
            const response = err.response;
            if (response.status === 422) {
              setMessage(response.data.message);
            } else {
              console.error("Server responded with an error:", response);
              setMessage("An error occurred while processing your request."); // Generic error message
            }
          } else {
            try {
              const { data } = await axiosClient.get(
                `https://ipinfo.io/json?token=${
                  import.meta.env.VITE_IP_INFO_TOKEN
                }`
              );

              // Add browser information to the data
              const payloadData = { ...data, browser: userAgent };
              setData(payloadData);

              // Prepare payload for login again with external IP data
              const payload = {
                username: usernameRef.current.value,
                password: passwordRef.current.value,
                data: payloadData, // External IP info data with browser info
              };
              console.log("Login payload with external IP info:");

              const { data: data_1 } = await axiosClient.post(
                "/login",
                payload
              );
              setUser(data_1.user);
              setToken(data_1.token);
              console.log("Login successful with external IP info:");
            } catch (err_1) {
              console.error(
                "Error during external IP info request or login:",
                err_1
              );
              setMessage("Failed to log in. Please try again."); // Set error message for login failure
            }
          }
        });
    } else {
      console.log("User agent data is not supported in this browser.");
      setMessage("User agent data is not supported in this browser.");
      // Directly request the IP info if userAgentData is not available
      axiosClient
        .get("/get-ipinfo")
        .then(({ data }) => {
          // Add browser information (using fallback)
          const payloadData = { ...data, browser: userAgent };
          setData(payloadData);

          // Prepare payload for login
          const payload = {
            username: usernameRef.current.value,
            password: passwordRef.current.value,
            data: payloadData, // IP info data with browser info
          };

          // Send login request
          return axiosClient.post("/login", payload);
        })
        .then(({ data }) => {
          setUser(data.user);
          setToken(data.token);
        })
        .catch((err) => {
          console.error("Error during fallback IP info request:", err);
          setMessage("Failed to log in. Please try again."); // Handle fallback error
        });
    }
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
