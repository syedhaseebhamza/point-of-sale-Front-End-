import React, { ChangeEvent, useEffect, useState } from "react";
import Input from "./common/inputField";
import Button from "./common/button";
import {
  handelAddNewItem,
  handelUpdateItem,
} from "@/app/features/Item/itemApi";
import { MinusIcon, PlusIcon } from "./ui-icons";

function ItemModal({
  catagory,
  onItemAdded,
  closeItemModal,
  setToast,
  selectedItemId,
  items,
  onItemUpdated,
  isEditMode,
}: any) {
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedCatagoryId, setSelectedCatagoryId] = useState("");
  const [itemPicture, setItemPicture] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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
  const handleItemPicture = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setItemPicture(file);
      setImagePreview(URL.createObjectURL(file));
    }
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
      const formData = new FormData();
      formData.append("categoryName", selectedValue);
      formData.append("name", formValues.name);
      formData.append("retailPrice", formValues.retailPrice);
      formData.append("variants", JSON.stringify(variants));
      
      if (itemPicture) {
        formData.append("image", itemPicture);
      }
  
      const response = await handelAddNewItem(formData, selectedCatagoryId);
      
      if (response.message === "Item created successfully") {
        onItemAdded(response.newItem);
      } else {
        onItemAdded(response.item);
      }
  
      setToast({
        type: "success",
        message: "Item added successfully",
      });
    } catch (error: any) {
      console.error("Error:", error);
      setToast({
        type: "error",
        message: error.message,
      });
    } finally {
      closeItemModal();
    }
  };
  

  const handleSave = async () => {
    
      const formData = new FormData();
      formData.append("categoryName", formValues.categoryName);
      formData.append("name", formValues.name);
      formData.append("retailPrice", formValues.retailPrice);
      formData.append("variants", JSON.stringify(variants));
      
      if (itemPicture) {
        formData.append("image", itemPicture);
      }
      try {
        
      await handelUpdateItem(formData, selectedItemId);
      
      closeItemModal();
      onItemUpdated();
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };
  

  useEffect(() => {
    if (isEditMode && selectedItemId) {
      const selectedItem = items.find(
        (item: any) => item._id === selectedItemId
      );
      if (selectedItem) {
        setFormValues({
          categoryName: selectedItem.categoryName,
          name: selectedItem.name,
          retailPrice: selectedItem.retailPrice,
        });
        setImagePreview(selectedItem.image || null);
        setSelectedCatagoryId(selectedItem.catagoryId);
        setSelectedValue(selectedItem.categoryName);
        setVariants(selectedItem.variants);
      }
    }
  }, [isEditMode, selectedItemId, items]);

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
            value={formValues.name}
            name="name"
            placeholder="Name"
            label="Name"
            onChange={handelItemFormChange}
          />
          <Input
            value={formValues.retailPrice}
            type="number"
            name="retailPrice"
            placeholder="Reail Price"
            label="Reail Price"
            onChange={handelItemFormChange}
          />
           <div>
            <input
              onChange={handleItemPicture}
              accept="image/*"
              id="itemPicture"
              hidden
              type="file"
            />

            <div>Upload image</div>
            {imagePreview ? (
              <div className="flex justify-center items-center min-h-[60px] max-h-[60px] min-w-[60px] max-w-[60px] mt-[13px] border border-[gray] rounded-full">
                <img
                  src={imagePreview}
                  alt="Selected"
                  className="min-h-[40px]  max-h-[40px] min-w-[40px] max-w-[40px] object-cover rounded-full"
                />
              </div>
            ) : (
              <label
                className="flex mt-[10px] justify-center rounded-full items-center cursor-pointer bg-[#E8E8E8] w-[60px] h-[60px]"
                htmlFor="itemPicture"
              >
                <div className="flex justify-center rounded-full  min-h-[40px] max-h-[40px] min-w-[40px] max-w-[40px] border-[gray] items-center text-[40px]">
                  <PlusIcon />
                </div>
              </label>
            )}
          </div>
        </div>
        <div className="flex flex-col border-t-2  pt-[1rem]">
          <div className="text-[20px] font-medium ">Varients</div>
          <div className="flex items-end justify-end">
            <div
              onClick={handleAddVariant}
              className="cursor-pointer flex mt-[10px] justify-center rounded-full items-center  bg-[#E8E8E8] w-[40px] h-[40px]"
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
                type="number"
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
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-end justify-end ">
          <Button
            onClick={isEditMode ? handleSave : handleSubmit}
            label="Save"
            className="px-[4rem]"
          />
        </div>
      </div>
    </div>
  );
}

export default ItemModal;
