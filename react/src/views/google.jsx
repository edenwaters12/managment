import React, { useEffect, useState } from 'react';
import axios from 'axios';
import axiosClient from "../axios-client.js";

const GoogleAuth = () => {
    const [files, setFiles] = useState([]);
    
    const authenticate = async () => {
        try {
            const response = await axiosClient.get('/api/auth/google');
            window.location.href = response.data.authUrl; // Redirect to Google auth URL
        } catch (error) {
            console.error("Error during authentication", error);
        }
    };

    const fetchFiles = async () => {
        try {
            const response = await axiosClient.get('/api/files', {
                headers: { Authorization: `Bearer ${localStorage.getItem('user_token')}` }, // Assuming you have a user token in local storage
            });
            setFiles(response.data);
        } catch (error) {
            console.error("Error fetching files", error);
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('code')) {
            fetchFiles(); // Call fetchFiles once authenticated
        } else {
            authenticate(); // Start authentication
        }
    }, []);

    const handleLogin = () => {
        window.location.href = 'http://127.0.0.1:8000/api/auth/google';
      };

    return (
        <div>
            <h1>Files in Google Drive</h1>
            <ul>
                {files.map(file => (
                    <li key={file.id}>{file.name}</li>
                ))}
            </ul>
            <button onClick={handleLogin}>Login with Google</button>
            <button onClick={handleLogin}>get token</button>
        </div>
    );
};

export default GoogleAuth;
