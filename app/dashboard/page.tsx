/* eslint-disable react/no-unescaped-entities */
// app/dashboard/page.tsx
'use client'; // Mark this as a client component

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const router = useRouter();
  
  const [adminName] = useState('Admin'); // Hardcoded admin name, replace with dynamic data if available
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  // Logout Function
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated'); // Clear authentication
    router.push('/login'); // Redirect to login page
  };

  // Fetch counts for users and records
  useEffect(() => {
    // Simulate an API call to get total users and records
    const fetchCounts = async () => {
      // Mock API data (replace with actual API call)
      const usersCount = 120; // Example user count
      const recordsCount = 350; // Example records count

      setTotalUsers(usersCount);
      setTotalRecords(recordsCount);
    };

    fetchCounts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-700">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Welcome Message */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700">
          Welcome, {adminName}!
        </h2>
        <p className="text-gray-600">Here's an overview of your system:</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
          <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Total Records</h3>
          <p className="text-2xl font-bold text-gray-900">{totalRecords}</p>
        </div>
      </div>

      {/* Actionable Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Users Management Section */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-gray-700">Users Management</h2>
          <p className="text-gray-600 mt-2">View and manage users, including detailed information.</p>
          <button
            onClick={() => router.push('/users')}
            className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          >
            Go to Users
          </button>
        </div>

        {/* Records Management Section */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-gray-700">Records Management</h2>
          <p className="text-gray-600 mt-2">View, filter, and manage records.</p>
          <button
            onClick={() => router.push('/records')}
            className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          >
            Go to Records
          </button>
        </div>
      </div>
    </div>
  );
}
