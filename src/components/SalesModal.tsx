import React, { useState } from "react";
import Input from "./common/inputField";
import Button from "./common/button";
import { MinusIcon } from "./ui-icons";

function SalesModal({ catagory, items }: any) {
  const [formEntries, setFormEntries] = useState([
    {
      selectedCategoryValue: "",
      selectedItemValue: "",
      quantity: "",
      isOpenCategory: false,
      isOpenItem: false,
    },
  ]);

  const toggleCategoryDropdown = (index: number) => {
    const updatedEntries = [...formEntries];
    updatedEntries[index].isOpenCategory =
      !updatedEntries[index].isOpenCategory;
    setFormEntries(updatedEntries);
  };

  const toggleItemDropdown = (index: number) => {
    const updatedEntries = [...formEntries];
    updatedEntries[index].isOpenItem = !updatedEntries[index].isOpenItem;
    setFormEntries(updatedEntries);
  };

  const handleSelectCategoryValue = (value: string, index: number) => {
    const updatedEntries = [...formEntries];
    updatedEntries[index].selectedCategoryValue = value;
    updatedEntries[index].isOpenCategory = false;
    setFormEntries(updatedEntries);
  };

  const handleSelectItemValue = (value: string, index: number) => {
    const updatedEntries = [...formEntries];
    updatedEntries[index].selectedItemValue = value;
    updatedEntries[index].isOpenItem = false;
    setFormEntries(updatedEntries);
  };

  const handleInputChange = (value: string, index: number) => {
    const updatedEntries = [...formEntries];
    updatedEntries[index].quantity = value;
    setFormEntries(updatedEntries);
  };

  const handleRemoveEntry = (index: number) => {
    const updatedEntries = formEntries.filter((_, i) => i !== index);
    setFormEntries(updatedEntries);
  };

  return (
    <div>
      <div className="overflow-auto max-h-[500px] w-[800px] bg-white px-16 py-16 ">
        {formEntries.map((entry, index) => (
          <div
            key={index}
            className="grid grid-cols-2 gap-x-4 gap-y-4 py-[1rem] border-b-[2px] border-b-gray-300 relative"
          >
            <div className="relative">
              <div className="text-[black] mb-4 text-[14px]">Category</div>
              <button
                type="button"
                onClick={() => toggleCategoryDropdown(index)}
                className="inline-flex justify-between w-full px-3 py-[13px] text-sm font-medium text-gray-700 bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
              >
                <span className="mr-2">
                  {entry.selectedCategoryValue || "Category"}
                </span>
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

              {entry.isOpenCategory && (
                <div className="absolute h-[10rem] overflow-auto top-[6rem] w-[328px]  mt-2 rounded-md shadow-lg bg-white ring-1 ring-black z-10 ring-opacity-5 p-1 space-y-1">
                  {catagory?.map((option: any) => (
                    <a
                      key={option._id}
                      href="#"
                      onClick={() =>
                        handleSelectCategoryValue(option.name, index)
                      }
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 active:bg-blue-100 cursor-pointer rounded-md"
                    >
                      {option.name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <div className="text-[black] mb-4 text-[14px]">Items</div>
              <button
                type="button"
                onClick={() => toggleItemDropdown(index)}
                className="inline-flex justify-between w-full px-3 py-[13px] text-sm font-medium text-gray-700 bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
              >
                <span className="mr-2">
                  {entry.selectedItemValue || "Items"}
                </span>
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

              {entry.isOpenItem && (
                <div className="absolute h-[10rem] overflow-auto top-[6rem] w-[328px] mt-2 rounded-md shadow-lg bg-white ring-1 ring-black z-10 ring-opacity-5 p-1 space-y-1">
                  {items?.map((option: any) => (
                    <a
                      key={option._id}
                      href="#"
                      onClick={() => handleSelectItemValue(option.name, index)}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 active:bg-blue-100 cursor-pointer rounded-md"
                    >
                      {option.name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <Input
              name="quantity"
              placeholder="Quantity"
              label="Quantity"
              value={entry.quantity}
              onChange={(e) => handleInputChange(e.target.value, index)}
            />
            {formEntries.length > 1 && (
              <div
                onClick={() => handleRemoveEntry(index)}
                className="absolute right-[-3rem] top-[4rem] cursor-pointer"
              >
                <MinusIcon />
              </div>
            )}
          </div>
        ))}

        <div className="flex justify-end gap-4 pt-[1rem]">
          <Button
            label="Check out"

          />
          <Button
            label="Add New"
            onClick={() => {
              setFormEntries([
                ...formEntries,
                {
                  selectedCategoryValue: "",
                  selectedItemValue: "",
                  quantity: "",
                  isOpenCategory: false,
                  isOpenItem: false,
                },
              ]);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default SalesModal;
