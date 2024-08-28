import React, { useState } from "react";
import Input from "./common/inputField";
import Button from "./common/button";
import { handelAddNewItem } from "@/app/features/Item/itemApi";

function ItemModal({ catagory, onItemAdded, closeItemModal }: any) {
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedCatagoryId, setSelectedCatagoryId] = useState("");
  const [formValues, setFormValues] = useState({
    categoryName: selectedValue,
    retailPrice: "",
    salePrice: "",
    discount: "",
    size: "",
  });
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };
  const handleSelectValue = (value: string, id: any) => {
    setSelectedCatagoryId(id);
    setSelectedValue(value);
    setFormValues((prevValues) => ({
      ...prevValues,
      categoryName: value,
    }));
    setIsOpen(false);
  };

  const handelItemFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      const updatedFormValues = {
        ...formValues,
        categoryName: selectedValue,
      };
      const response = await handelAddNewItem(
        updatedFormValues,
        selectedCatagoryId
      );
      onItemAdded(response.newItem);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      closeItemModal();
    }
  };

  return (
    <div>
      <div className="max-h-[400px] h-[400px] lg:w-[400px] lg:max-w-[400px] 2xl:w-[800px] 2xl:max-w-[800px] bg-white px-16 pt-20 pb-[25rem]">
        <div className="grid grid-cols-2 gap-x-4 gap-y-4">
          <div>
            <div className="text-[black] mb-2 text-[14px]">Category</div>
            <button
              type="button"
              onClick={toggleDropdown}
              className="inline-flex justify-between  w-full px-3 py-[13px] text-sm font-medium text-gray-700 bg-white border border-gray-300  shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
            >
              <span className="mr-2">{selectedValue || "Category"}</span>
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
              <div className="absolute h-[7rem] overflow-auto  top-[10rem]   left-[4rem] mt-2 rounded-md shadow-lg bg-white ring-1 ring-black z-10 ring-opacity-5 p-1 space-y-1">
                {catagory?.map((option: any) => (
                  <a
                    key={option.id}
                    href="#"
                    onClick={() => handleSelectValue(option.name, option._id)}
                    className="block px-4 py-2  text-gray-700 hover:bg-gray-100 active:bg-blue-100 cursor-pointer rounded-md"
                  >
                    {option.name}
                  </a>
                ))}
              </div>
            )}
          </div>
          <Input
            name="retailPrice"
            placeholder="Reail Price"
            label="Reail Price"
            onChange={handelItemFormChange}
          />

          <Input
            onChange={handelItemFormChange}
            name="salePrice"
            placeholder="Sale Price"
            label="Sale Price"
          />

          <Input
            onChange={handelItemFormChange}
            name="discount"
            placeholder="Discount"
            label="Discount"
          />

          <Input
            onChange={handelItemFormChange}
            name="size"
            placeholder="Size"
            label="Size"
          />
        </div>

        <div className="flex items-end justify-end ">
          <Button onClick={handleSubmit} label="Save" className="px-[4rem]" />
        </div>
      </div>
    </div>
  );
}

export default ItemModal;
