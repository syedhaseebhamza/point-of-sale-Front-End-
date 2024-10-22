import React, { useState, ChangeEvent, useEffect } from "react";
import Input from "./common/inputField";
import Button from "./common/button";
import {
  handelAddCatagory,
  handelUpdateCategory,
} from "@/app/features/catagory/catagoryApi";
import { PlusIcon } from "./ui-icons";

function CatagaryModal({
  closeCatagaryModal,
  onCategoryAdded,
  setToast,
  selectedCategoryId,
  allCatagory,
  isEditMode,
  onCategoryUpdated,
}: any) {
  const [categoryValues, setCategoryValues] = useState({
    name: "",
    description: "",
  });
  const [categoryPicture, setCategoryPicture] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const handleCategoryFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCategoryValues({
      ...categoryValues,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", categoryValues.name);
    formData.append("description", categoryValues.description);

    if (categoryPicture) {
      formData.append("image", categoryPicture);
    }

    try {
      const response = await handelAddCatagory(formData);
      onCategoryAdded(response.newCategory);
      setToast({ type: "success", message: "Category added successfully!" });
    } catch (error) {
      console.error("Error:", error);
      setToast({
        type: "error",
        message: "Failed to add category Name & Description are required",
      });
    } finally {
      closeCatagaryModal();
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("name", categoryValues.name);
    formData.append("description", categoryValues.description);
    if (categoryPicture) {
      formData.append("image", categoryPicture);
    }

    try {
      const updatedCategory = await handelUpdateCategory(
        formData,
        selectedCategoryId
      );
      if (updatedCategory.message === "Category updated successfully") {
        onCategoryUpdated();
      }
      setToast({
        type: "success",
        message: "Category updated successfully!",
      });
    } catch (error: any) {
      setToast({
        type: "error",
        message: error.message || "Failed to update category",
      });
      console.error("Failed to update category", error);
    } finally {
      closeCatagaryModal();
    }
  };

  const handleCampaignPicture = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setCategoryPicture(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (isEditMode) {
      const selectedCategory = allCatagory.find(
        (item: any) => item._id === selectedCategoryId
      );
      if (selectedCategory) {
        setCategoryValues({
          name: selectedCategory.name || "",
          description: selectedCategory.description || "",
        });
        setImagePreview(selectedCategory.image || null);
      }
    }
  }, [selectedCategoryId, allCatagory]);
  return (
    <div className="max-h-[400px] h-[400px] w-[800px] bg-white px-16 py-16 ">
      <div className="flex flex-col justify-between h-[300px] ">
        {" "}
        <div className="grid grid-cols-2 gap-x-4 gap-y-4">
          <Input
            value={categoryValues.name}
            placeholder="Name"
            onChange={handleCategoryFormChange}
            name="name"
            label="Name"
          />
          <Input
            value={categoryValues.description}
            placeholder="Description"
            onChange={handleCategoryFormChange}
            name="description"
            label="Description"
          />
          <div>
            <input
              onChange={handleCampaignPicture}
              accept="image/*"
              id="categoryPicture"
              hidden
              type="file"
            />

            <div>Upload image</div>
            {imagePreview ? (
              <div className="relative flex justify-center items-center min-h-[60px] max-h-[60px] min-w-[60px] max-w-[60px] mt-[13px] border border-gray-300 rounded-full">
                <img
                  src={imagePreview}
                  alt="Selected"
                  className="min-h-[40px] max-h-[40px] min-w-[40px] max-w-[40px] object-cover rounded-full"
                />
                <label
                  className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 rounded-full opacity-0 hover:opacity-100 cursor-pointer"
                  htmlFor="categoryPicture"
                >
                  <PlusIcon className="text-white text-[24px]" />
                </label>
              </div>
            ) : (
              <label
                className="flex mt-[10px] justify-center rounded-full items-center cursor-pointer bg-[#E8E8E8] w-[60px] h-[60px]"
                htmlFor="categoryPicture"
              >
                <div className="flex justify-center rounded-full min-h-[40px] max-h-[40px] min-w-[40px] max-w-[40px] border-[gray] items-center text-[40px]">
                  <PlusIcon />
                </div>
              </label>
            )}
          </div>
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

export default CatagaryModal;