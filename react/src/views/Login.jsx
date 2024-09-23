import axiosClient from "../axios-client.js";
import { useRef, useState } from "react";
import { useStateContext } from "../context/ContextProvider.jsx";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button.jsx";

export default function Login() {
  const usernameRef = useRef(); // Use useRef instead of createRef
  const passwordRef = useRef();
  const { setUser, setToken } = useStateContext();
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = (ev) => {
    ev.preventDefault();
    setLoading(true);

    const userAgent = navigator.userAgent;
    let browserDetails = {};

    // Check if userAgentData is available
    if ("userAgentData" in navigator) {
      navigator.userAgentData
        .getHighEntropyValues(["platform", "brands"])
        .then((data) => {
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
            mobile: /Mobi|Android/i.test(navigator.userAgent),
          };

          return axiosClient.get(`https://ipinfo.io/json?token=${import.meta.env.VITE_IP_INFO_TOKEN}`);
        })
        .then(({ data }) => {
          const payload = {
            username: usernameRef.current.value, // Access value safely
            password: passwordRef.current.value, // Access value safely
            data: data,
            more: browserDetails,
          };

          console.log("Payload for login:", payload); // Log the payload
          return axiosClient.post("/login", payload);
        })
        .then(({ data }) => {
          setUser(data.user);
          setToken(data.token);
        })
        .catch((err) => {
          console.error("Error during login:", err);
          setMessage(err.response?.data?.message || "Failed to log in. Please try again.");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      console.log("User agent data is not supported in this browser.");
      setMessage("User agent data is not supported in this browser.");
      axiosClient
        .get("/get-ipinfo")
        .then(({ data }) => {
          const payloadData = { ...data, browser: userAgent };
          const payload = {
            username: usernameRef.current.value, // Access value safely
            password: passwordRef.current.value, // Access value safely
            data: payloadData,
          };

          console.log("Fallback Payload for login:", payload); // Log fallback payload
          return axiosClient.post("/login", payload);
        })
        .then(({ data }) => {
          setUser(data.user);
          setToken(data.token);
        })
        .catch((err) => {
          console.error("Error during fallback login:", err);
          setMessage(err.response?.data?.message || "Failed to log in. Please try again.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-[360px] relative z-10 bg-black max-w-[360px] p-8 shadow-sm">
        <form onSubmit={onSubmit}>
          <h1 className="text-lg mb-4 text-center">Login</h1>
          <Input
            ref={usernameRef}
            type="text"
            placeholder="Enter your username"
            className="block w-full mb-4 p-2 border rounded"
            name="username"
            required
          />
          <Input
            ref={passwordRef}
            type="password"
            placeholder="Enter Password"
            className="block w-full mb-4 p-2 border rounded"
            name="password"
            required
          />
          <Button
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-sky-700"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
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
