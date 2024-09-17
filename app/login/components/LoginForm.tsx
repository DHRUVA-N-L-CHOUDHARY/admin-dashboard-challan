// app/login/components/LoginForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Use next/navigation for navigation

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false); // For error popup
  const router = useRouter(); // For navigation

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset error state on new submit
    setShowError(false);

    // Simple hardcoded authentication logic (replace with real authentication later)
    if (username === "admin" && password === "password") {
      localStorage.setItem("isAuthenticated", "true"); // Set authentication state in localStorage
      router.push("/dashboard"); // Redirect to dashboard
    } else {
      setShowError(true); // Show error popup if login fails
    }
  };

  const closeModal = () => {
    setShowError(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black-500 focus:border-black-500 sm:text-sm"
            placeholder="Enter username"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black-500 focus:border-black-500 sm:text-sm"
            placeholder="Enter password"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
        >
          Login
        </button>
      </form>

      {showError && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative text-center ">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Error</h2>
            <p className="text-gray-600">
              Invalid username or password.
            </p>
            <p className="text-gray-600">Please try again.</p>
            <button
              onClick={closeModal}
              className="mt-6 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 inline-block"
              style={{ display: "inline-block", whiteSpace: "nowrap" }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
