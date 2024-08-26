import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { getAllSubUser, deleteSubUser } from "../app/features/admin/adminApi";
import Button from "@/components/common/button";
import Modal from "@/components/common/modal/modal";
import NewUser from "@/components/AddNewUser";
import EditUser from "@/components/EditUser";
interface SubUser {
  _id: string;
  username: string;
  role: string;
}

function UserPage() {
  const [subUsers, setSubUsers] = useState<SubUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [showAddNewUSerModal, setShowAddNewUSerModal] = useState(false);
  const [showEditUSerModal, setShowEditUSerModal] = useState(false);

  const openAddNewUserModal = () => setShowAddNewUSerModal(true);
  const closeAddNewUserModal = () => setShowAddNewUSerModal(false);

  const closeEditUserModal = () => setShowEditUSerModal(false);

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
            onClick={openAddNewUserModal}
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
                          className="cursor-pointer"
                          icon={faEdit}
                          onClick={() => {
                            setSelectedUserId(user._id);
                            setShowEditUSerModal(true);
                          }}
                        />
                      </span>
                      <span>
                        <FontAwesomeIcon
                          className="cursor-pointer"
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
      <Modal
        isModalOpen={showAddNewUSerModal}
        onModalClose={closeAddNewUserModal}
      >
        <NewUser
          setShowAddNewUSerModal={setShowAddNewUSerModal}
          setSubUsers={setSubUsers}
        />
      </Modal>
      <Modal isModalOpen={showEditUSerModal} onModalClose={closeEditUserModal}>
        <EditUser
          selectedUserId={selectedUserId}
          setSubUsers={setSubUsers}
          subUsers={subUsers}
          setShowEditUSerModal={setShowEditUSerModal}
        />
      </Modal>
    </div>
  );
}
export default UserPage;
