import React, { useState } from "react";
import Input from "./common/inputField";
import Button from "./common/button";
import { handelAddNewItem } from "@/app/features/Item/itemApi";
import { MinusIcon, PlusIcon } from "./ui-icons";

function ItemModal({ catagory, onItemAdded, closeItemModal }: any) {
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedCatagoryId, setSelectedCatagoryId] = useState("");
  const [variants, setVariants] = useState([{ size: "", price: "" }]);
  const [formValues, setFormValues] = useState({
    categoryName: selectedValue,
    name: "",
    retailPrice: "",
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

  const handleVariantChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const newVariants = [...variants];
    newVariants[index] = {
      ...newVariants[index],
      [name]: value,
    };
    setVariants(newVariants);
  };

  const handleAddVariant = () => {
    setVariants([...variants, { size: "", price: "" }]);
    
  };
  
  const handleRemoveVariant = (index: number) => {
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
  };

  const handleSubmit = async () => {
    try {
      const updatedFormValues = {
        ...formValues,
        categoryName: selectedValue,
        variants,
      };
      const response = await handelAddNewItem(
        updatedFormValues,
        selectedCatagoryId
      );
      if (response.message === "Item created successfully") {
        onItemAdded(response.newItem);
      } else {
        onItemAdded(response.item);
      }

      console.log("response", response);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      closeItemModal();
    }
  };

  return (
    <div>
      <div className="overflow-auto max-h-[500px] w-[800px] bg-white px-16 py-16 ">
        <div className="grid grid-cols-2 gap-x-4 gap-y-4 pb-[1rem]">
          <div>
            <div className="text-[black] mb-4 text-[14px]">Category</div>
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
              <div className="absolute h-[10rem] overflow-auto  top-[10rem] w-[328px]  left-[4rem] mt-2 rounded-md shadow-lg bg-white ring-1 ring-black z-10 ring-opacity-5 p-1 space-y-1">
                {catagory?.map((option: any) => (
                  <a
                    key={option._id}
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
            name="name"
            placeholder="Name"
            label="Name"
            onChange={handelItemFormChange}
          />
          <Input
            name="retailPrice"
            placeholder="Reail Price"
            label="Reail Price"
            onChange={handelItemFormChange}
          />
        </div>
        <div className="flex flex-col border-t-2  pt-[1rem]">
          <div className="text-[20px] font-medium ">Varients</div>
          <div className="flex items-end justify-end">
            <div
              onClick={handleAddVariant}
              className="cursor-pointer flex mt-[10px] justify-center rounded-full items-center  bg-[#E8E8E8] w-[60px] h-[60px]"
            >
              <PlusIcon />
            </div>
          </div>
          {variants.map((variant, index) => (
            <div
              key={index}
              className="grid grid-cols-2 gap-x-4 gap-y-4 pb-[1rem] relative"
            >
              <Input
                name="size"
                placeholder="Size"
                label="Size"
                value={variant.size}
                onChange={(e) => handleVariantChange(index, e)}
              />
              <Input
                name="price"
                placeholder="Sale Price"
                label="Sale Price"
                value={variant.price}
                onChange={(e) => handleVariantChange(index, e)}
              />
               {variants.length > 1 && (
              <div
                onClick={() => handleRemoveVariant(index)}
                className="absolute right-[-2.8rem]  top-[3rem] cursor-pointer"
              >
                <MinusIcon />
              </div> )}
            </div>
          ))}
        </div>
        <div className="flex items-end justify-end ">
          <Button onClick={handleSubmit} label="Save" className="px-[4rem]" />
        </div>
      </div>
    </div>
  );
}

export default ItemModal;
