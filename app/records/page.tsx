"use client";

import { useState, useEffect, SetStateAction } from "react";
import { useRouter } from "next/navigation";

interface Record {
  recordID: string;
  userID: string;
  recordName: string;
  amount: number;
  remarks: string;
  imageUrl: string;
  busNumber: string;
  isPaid: boolean;
  isDelete: boolean;
  challanType: string;
  createdAt: Date;
}

interface RecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: Record | null;
  markAsPaid: (recordID: string) => void;
  deleteRecord: (recordID: string) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Modal Component
const RecordModal: React.FC<RecordModalProps> = ({
  isOpen,
  onClose,
  record,
  markAsPaid,
  deleteRecord,
}) => {
  if (!isOpen || !record) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Record Details
        </h2>

        <div className="mb-4">
          <p className="text-sm text-gray-600">
            <strong>ID:</strong> {record.recordID}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Name:</strong> {record.recordName}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Bus Number:</strong> {record.busNumber}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Amount:</strong> ${record.amount}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Remarks:</strong> {record.remarks || "N/A"}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Status:</strong>{" "}
            <span
              className={record.isDelete ? "text-red-600" : "text-green-600"}
            >
              {record.isDelete ? "Inactive" : "Active"}
            </span>
          </p>
          <p className="text-sm text-gray-600">
            <strong>Payment:</strong>{" "}
            <span className={record.isPaid ? "text-green-600" : "text-red-600"}>
              {record.isPaid ? "Paid" : "Unpaid"}
            </span>
          </p>
        </div>

        {/* Mark as Paid Button */}
        {!record.isPaid && (
          <button
            onClick={() => markAsPaid(record.recordID)} // <-- This should be markAsPaid
            className="w-full mb-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            Mark as Paid
          </button>
        )}

        <button
          onClick={() => deleteRecord(record.recordID)} // <-- Add delete functionality
          className="w-full mb-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          Delete Record
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
  );
};

export default function RecordsPage() {
  const router = useRouter();

  const [records, setRecords] = useState<Record[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'active', 'inactive'
  const [paymentFilter, setPaymentFilter] = useState("all"); // 'all', 'paid', 'unpaid'
  const [sortKey, setSortKey] = useState("createdAt"); // 'recordName', 'amount', 'createdAt'
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const recordsPerPage = 10; // Number of records per page

  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

    // Change page
    const paginate = (pageNumber: SetStateAction<number>) => setCurrentPage(pageNumber);

  // Fetch records data from the API
  const fetchRecords = async () => {
    console.log(currentPage);
    try {
      const response = await fetch(`${API_URL}/api/v1/record/all`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          search: searchTerm,
          isPaid:
            paymentFilter === "paid"
              ? true
              : paymentFilter === "unpaid"
              ? false
              : undefined,
          isDelete:
            statusFilter === "active"
              ? false
              : statusFilter === "inactive"
              ? true
              : undefined,
          sortBy: sortKey,
          sortOrder: 'asc',
          page: currentPage,
          limit: recordsPerPage,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch records");
      }

      const data = await response.json();
      console.log(data);
      setRecords(data.records);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
      // setTotalRecords(data.totalRecords);
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [
    searchTerm,
    statusFilter,
    paymentFilter,
    sortKey,
    currentPage,
  ]);

  // Open Modal
  const openRecordModal = (record: Record) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  // Close Modal
  const closeRecordModal = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
  };

  // Mark as Paid (without API in this example, just local state update)
  const markAsPaid = (recordID: string) => {
    setRecords((prevRecords) =>
      prevRecords.map((record) =>
        record.recordID === recordID ? { ...record, isPaid: true } : record
      )
    );
    closeRecordModal();
  };

  const deleteRecord = async (recordID: string) => {
    try {
      const response = await fetch(`${API_URL}/${recordID}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete record");
      }

      // Update local state after deleting the record
      setRecords((prevRecords) =>
        prevRecords.filter((record) => record.recordID !== recordID)
      );
      setIsModalOpen(false); // Close the modal
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  // Sorting and filtering logic (unchanged)
  const sortedRecords = [...records].sort((a, b) => {
    if (sortKey === "recordName") {
      return a.recordName.localeCompare(b.recordName);
    } else if (sortKey === "amount") {
      return a.amount - b.amount;
    } else if (sortKey === "createdAt") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    return 0;
  });

  const filteredRecords = sortedRecords.filter((record) => {
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && !record.isDelete) ||
      (statusFilter === "inactive" && record.isDelete);
    const matchesPayment =
      paymentFilter === "all" ||
      (paymentFilter === "paid" && record.isPaid) ||
      (paymentFilter === "unpaid" && !record.isPaid);
    return matchesStatus && matchesPayment;
  });

  const displayedRecords = filteredRecords.filter(
    (record) =>
      record.recordName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.busNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-700">Records List</h1>
        <button
          onClick={() => router.push("/dashboard")}
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Search, Sort, Filter */}
      <div className="flex items-center justify-between mb-6 space-x-4">
        <input
          type="text"
          placeholder="Search by name or bus number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black placeholder-gray-400 text-sm"
        />

        {/* Filter by Status (Active/Inactive) */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black text-sm"
        >
          <option value="all">All Records</option>
          <option value="active">Active Records</option>
          <option value="inactive">Inactive Records</option>
        </select>

        {/* Filter by Payment (Paid/Unpaid) */}
        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black text-sm"
        >
          <option value="all">All Records</option>
          <option value="paid">Paid Records</option>
          <option value="unpaid">Unpaid Records</option>
        </select>

        {/* Sort by */}
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black text-sm"
        >
          <option value="createdAt">Sort by Date</option>
          <option value="recordName">Sort by Name</option>
          <option value="amount">Sort by Amount</option>
        </select>
      </div>

      {/* Table Layout */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium">
                Record Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium">
                Bus Number
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium">
                Payment
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium">
                Created At
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {displayedRecords.map((record) => (
              <tr
                key={record.recordID}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {record.recordName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {record.busNumber}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {record.amount}
                </td>
                <td
                  className={`px-6 py-4 text-sm font-semibold ${
                    record.isDelete ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {record.isDelete ? "Inactive" : "Active"}
                </td>
                <td
                  className={`px-6 py-4 text-sm font-semibold ${
                    record.isPaid ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {record.isPaid ? "Paid" : "Unpaid"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {new Date(record.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => openRecordModal(record)}
                    className="px-4 py-2 text-white rounded-md transition-colors"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: totalPages }, (_, number) => (
          <button
            key={number + 1}
            onClick={() => paginate(number + 1)}
            className={`px-4 py-2 rounded-md ${
              currentPage === number + 1 ? "bg-black text-white" : "bg-gray-200 text-gray-700"
            } hover:bg-black hover:text-white transition-colors`}
          >
            {number + 1}
          </button>
        ))}
      </div>

      <RecordModal
        isOpen={isModalOpen}
        onClose={closeRecordModal}
        record={selectedRecord}
        markAsPaid={markAsPaid}
        deleteRecord={deleteRecord}
      />
    </div>
  );
}
