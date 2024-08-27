import React from 'react';
import { Button } from "@/components/ui/Button.jsx";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-500 dark:text-red-400">404</h1>
        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
          Oops! The page you’re looking for doesn’t exist.
        </p>
        <Button className="mt-6" onClick={() => window.location.href = '/'}>
          Go Back Home
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
