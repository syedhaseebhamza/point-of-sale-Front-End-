import React, { useState } from "react";
import Input from "./common/inputField";
import { useAppDispatch } from "@/app/hooks";
import { createUser } from "@/app/features/admin/adminSlice";
import Button from "./common/button";
import { getAllSubUser } from "@/app/features/admin/adminApi";

const userRoleOptions = [
  { userRole: "Cashier", id: 1 },
  { userRole: "Manager", id: 2 },
];

function NewUser({ setShowAddNewUSerModal, setSubUsers }: any) {
  const dispatch = useAppDispatch();
  const [selectedValue, setSelectedValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "",
  });

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };
  const handleSelectValue = (value: string) => {
    setSelectedValue(`${value}`);
    setFormData((prevFormData) => ({
      ...prevFormData,
      role: value,
    }));
    setIsOpen(false);
  };
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handelSubmit = async () => {
    setShowSpinner(true);
    try {
      dispatch(createUser(formData)).then((res) => {
        getAllSubUser().then((res) => {
          setSubUsers(res);
        });
      });
      setShowSpinner(false);
    } catch (error) {
      setShowAddNewUSerModal(false);
      setShowSpinner(false);
    }
  };

  return (
    <div className="max-h-[400px] h-[400px] lg:w-[400px]  lg:max-w-[400px] 2xl:w-[800px] 2xl:max-w-[800px] bg-white px-16 pt-20 pb-[25rem]">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <span>Username</span>
          <Input
            onChange={handleFormChange}
            name="username"
            className="rounded-[10px]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <span>Password</span>
          <Input
            onChange={handleFormChange}
            name="password"
            className="rounded-[10px]"
          />
        </div>
        <div>
          <div className="text-[black] mb-2 text-[14px]">Role</div>
          <button
            type="button"
            onClick={toggleDropdown}
            className="inline-flex justify-between rounded-[10px] w-full px-3 py-[13px] text-sm font-medium text-gray-700 bg-white border border-gray-300  shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
          >
            <span className="mr-2">{selectedValue || "Role"}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 ml-2 -mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M6.293 9.293a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute h-[7rem] overflow-auto  top-[23.8rem]   left-[4rem] mt-2 rounded-md shadow-lg bg-white ring-1 ring-black z-10 ring-opacity-5 p-1 space-y-1">
              {userRoleOptions?.map((option) => (
                <a
                  key={option.id}
                  href="#"
                  onClick={() => handleSelectValue(option.userRole)}
                  className="block px-4 py-2  text-gray-700 hover:bg-gray-100 active:bg-blue-100 cursor-pointer rounded-md"
                >
                  {option.userRole}
                </a>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-end justify-end pt-[10px]">
          <Button
            isLoading={showSpinner}
            label="submit"
            onClick={handelSubmit}
          />
        </div>
      </div>
    </div>
  );
}

export default NewUser;
