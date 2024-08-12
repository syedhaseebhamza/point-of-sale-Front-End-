import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";

function UserPage() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "cashier",
  });
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setShowModal(false);
    setFormData({
      username: "",
      password: "",
      role: "cashier",
    });
  };
  return (
    <div>
      <div className="p-8">
        <div className="flex justify-end items-center gap-3">
          <h1 className="text-2xl font-bold mb-[0.5rem]">User Management</h1>
          <button
            onClick={() => {
              setFormData({
                username: "",
                password: "",
                role: "cashier",
              });
              setShowModal(true);
            }}
            className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            Add User
          </button>
        </div>
        {showModal && (
          <div
            id="static-modal"
            data-modal-backdrop="static"
            aria-hidden="true"
            className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full max-h-full overflow-y-auto overflow-x-hidden"
          >
            <div className="relative p-4 w-full max-w-2xl max-h-full">
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Add New User
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    onClick={() => setShowModal(false)}
                  >
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
                <div className="p-4 md:p-5 space-y-4">
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label htmlFor="username" className="block text-gray-700">
                        Username
                      </label>
                      <input
                        onChange={handleFormChange}
                        value={formData.username}
                        type="text"
                        id="username"
                        name="username"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Enter username"
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="password" className="block text-gray-700">
                        Password
                      </label>
                      <input
                        value={formData.password}
                        onChange={handleFormChange}
                        type="password"
                        id="password"
                        name="password"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Enter password"
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="role" className="block text-gray-700">
                        Role
                      </label>
                      <select
                        value={formData.role}
                        onChange={handleFormChange}
                        id="role"
                        name="role"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="cashier">Cashier</option>
                        <option value="manager">Manager</option>
                      </select>
                    </div>
                    <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                      <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                      >
                        Add User
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        <div>
          <h2 className="text-xl font-semibold mb-4">Existing Users</h2>
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <thead>
              <tr>
                <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">
                  Username
                </th>
                <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">
                  Role
                </th>
                <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b border-gray-300">john_doe</td>
                <td className="py-2 px-4 border-b border-gray-300">Cashier</td>
                <td className="py-2 px-4 border-b border-gray-300">
                  <div className="flex items-center gap-3">
                    <span>
                      <FontAwesomeIcon icon={faEdit} />
                    </span>
                    <span>
                      <FontAwesomeIcon icon={faTrash} />
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UserPage;
