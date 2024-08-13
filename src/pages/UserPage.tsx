import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { createUser } from "../app/features/admin/adminSlice";
import { getAllSubUser, deleteSubUser } from "../app/features/admin/adminApi";
import Modal from "@/components/common/modal";
import Button from "@/components/common/button";
interface SubUser {
  _id: string;
  username: string;
  role: string;
}

function UserPage() {
  const dispatch = useAppDispatch();
  const [showModal, setShowModal] = useState(false);
  const [subUsers, setSubUsers] = useState<SubUser[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
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
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowSpinner(true);
    try {
      await dispatch(createUser(formData));
      const response = await getAllSubUser();
      setSubUsers(response);
    } catch (error: any) {
      console.log(error);
    } finally {
      setShowSpinner(false);
      setShowModal(false);
    }
  };

  const handelDeleteUser = (id: string) => {
    deleteSubUser(id)
      .then((res) => {
        const deleteUser = subUsers.filter((item) => item._id !== id);
        setSubUsers(deleteUser);
      })
      .catch((err) => {
        console.log("delete error", err);
      });
  };
  useEffect(() => {
    getAllSubUser()
      .then((res) => {
        console.log("res", res);
        setSubUsers(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <div className="p-8">
        <div className="flex justify-end items-center gap-3">
          <h1 className="text-2xl font-bold mb-[0.5rem]">User Management</h1>
          <Button
            onClick={() => setShowModal(true)}
            variant="dark_hover"
            label="Add User"
          />
        </div>
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
              {subUsers.map((user) => (
                <tr key={user._id}>
                  <td className="py-2 px-4 border-b border-gray-300">
                    {user.username}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-300">
                    {user.role}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-300">
                    <div className="flex items-center gap-[20px]">
                      <span>
                        <FontAwesomeIcon
                          icon={faEdit}
                          onClick={() => setShowEditModal(true)}
                        />
                      </span>
                      <span>
                        <FontAwesomeIcon
                          icon={faTrash}
                          onClick={() => handelDeleteUser(user._id)}
                        />
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <Modal
          show={showModal}
          onClose={() => setShowModal(false)}
          heading="Add New User"
          size="md"
          content={
            <div>
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
            </div>
          }
          footerContent={
            <Button
              type="button"
              label={"Next"}
              className="tw-h-[45px]"
              variant="dark_hover"
              onClick={handleSubmit}
              isLoading={showSpinner}
            />
          }
        />
      )}
    </div>
  );
}

export default UserPage;
