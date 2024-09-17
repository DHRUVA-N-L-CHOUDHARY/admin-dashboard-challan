"use client";
import { useState, useEffect, SetStateAction } from "react";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  userName: string;
  phoneNumber: string;
  accountType: string;
  active: boolean;
  imageUrl: string; // Added imageUrl from your data
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  updateUserStatus: (userId: string) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const UserModal = ({
  isOpen,
  onClose,
  user,
  updateUserStatus,
}: UserModalProps) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          User Details
        </h2>

        <div className="mb-4">
          <img
            src={user.imageUrl}
            alt="User Image"
            className="mb-4 w-full h-32 object-cover rounded-lg"
          />{" "}
          {/* Display user image */}
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-800">ID:</span> {user._id}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-800">User Name:</span>{" "}
            {user.userName}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-800">Phone Number:</span>{" "}
            {user.phoneNumber}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-800">Account Type:</span>{" "}
            {user.accountType}
          </p>
          <p className="text-sm">
            <span className="font-semibold text-gray-800">Status:</span>{" "}
            <span className={user.active ? "text-green-600" : "text-red-600"}>
              {user.active ? "Active" : "Inactive"}
            </span>
          </p>
        </div>

        {/* Flex container for buttons with responsive behavior */}
        <div className="flex flex-col md:flex-row md:space-x-4">
          {/* Toggle Status Button */}
          <button
            onClick={() => updateUserStatus(user._id)}
            className={`w-full mb-4 md:mb-0 px-4 py-2 ${
              user.active
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            } text-white rounded-md transition-colors`}
          >
            {user.active ? "Mark as Inactive" : "Mark as Active"}
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default function UsersPage() {
  const router = useRouter();

  // State to hold user data
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'active', 'inactive'
  const [sortKey, setSortKey] = useState("userName"); // 'id', 'name'
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false);
  const usersPerPage = 10; // Number of users to display per page

  // State for Modal
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setTotalPages(0);
    setNoData(false);
    setUsers([]);
    try {
      console.log(statusFilter);
      const response = await fetch(`${API_URL}/api/v1/user/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          search: searchTerm || "",
          active:
            statusFilter === "active"
              ? true
              : statusFilter === "all"
              ? true
              : false,
          sortBy: sortKey,
          sortOrder: "asc",
          page: currentPage,
          limit: usersPerPage,
        }),
      });
      if (!response.ok) {
        setNoData(true);
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      console.log(data);
      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, statusFilter, sortKey, currentPage]);

  // Change page
  const paginate = (pageNumber: SetStateAction<number>) =>
    setCurrentPage(pageNumber);

  // Open Modal and Pass User Data
  const openUserModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Close Modal
  const closeUserModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const searching = (e: { target: { value: SetStateAction<string> } }) => {
    setCurrentPage(1);
    setSearchTerm(e.target.value);
  };

  // Toggle User Status
  const updateUserStatus = (userId: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === userId
          ? {
              ...user,
              active: !user.active,
            }
          : user
      )
    );
    closeUserModal();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-700">Users List</h1>
        <button
          onClick={() => router.push("/dashboard")}
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center justify-between mb-6 space-x-4">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => searching(e)}
          className="px-4 py-2 text-black w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black placeholder-gray-400 text-sm"
        />

        {/* Filter by Status */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black text-sm"
        >
          <option value="all">All Users</option>
          <option value="active">Active Users</option>
          <option value="inactive">Inactive Users</option>
        </select>

        {/* Sort by */}
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          className="px-4 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black text-sm"
        >
          <option value="id">Sort by ID</option>
          <option value="name">Sort by Name</option>
        </select>
      </div>

      {/* Table Layout */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center text-black flex items-center justify-center h-96">
            Loading...
          </div>
        ) : noData ? (
          <div className="text-center text-black flex items-center justify-center h-96">
            {" "}
            No Users Found{" "}
          </div>
        ) : (
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium">ID</th>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  User Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Phone Number
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Account Type
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {user._id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {user.userName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {user.phoneNumber}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {user.accountType}
                  </td>
                  <td
                    className={`px-6 py-4 text-sm font-semibold ${
                      user.active ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {user.active ? "Active" : "Inactive"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => openUserModal(user)}
                      className="px-4 py-2 text-white rounded-md transition-colors text-sm"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-4 py-2 rounded-md ${
                currentPage === number
                  ? "bg-black text-white"
                  : "bg-gray-200 text-gray-700"
              } hover:bg-black hover:text-white transition-colors`}
            >
              {number}
            </button>
          )
        )}
      </div>

      {/* User Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={closeUserModal}
        user={selectedUser}
        updateUserStatus={updateUserStatus}
      />
    </div>
  );
}
