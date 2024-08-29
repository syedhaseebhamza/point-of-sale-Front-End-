import React, { ChangeEvent, useEffect, useState } from "react";
import { PlusIcon } from "./ui-icons";
import Button from "./common/button";
import Input from "./common/inputField";
import {
  handelUpdateCategory,
  getAllCatagory,
} from "@/app/features/catagory/catagoryApi";

function CatagaryEditModal({
  allCatagory,
  selectedCategoryId,
  closeCatagaryEditModal,
  onCategoryUpdated,
}: any) {
  const [formVal, setFormVal] = useState({
    name: "",
    description: "",
  });
  const [picture, setPicture] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const selectedCategory = allCatagory.find(
      (item: any) => item._id === selectedCategoryId
    );

    if (selectedCategory) {
      setFormVal({
        name: selectedCategory.name || "",
        description: selectedCategory.description || "",
      });
      setImagePreview(selectedCategory.image || null);
    }
  }, [selectedCategoryId, allCatagory]);

  const handleCategoryFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormVal({
      ...formVal,
      [name]: value,
    });
  };

  const handleCampaignPicture = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setPicture(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("name", formVal.name);
    formData.append("description", formVal.description);
    if (picture) {
      formData.append("image", picture);
    }

    try {
      const updatedCategory = await handelUpdateCategory(
        formData,
        selectedCategoryId
      );
      if (updatedCategory.message === "Category updated successfully") {
        onCategoryUpdated();
      }
      console.log("updatedCategory", updatedCategory);
    } catch (error) {
      console.error("Failed to update category", error);
    } finally {
      closeCatagaryEditModal();
    }
  };

  return (
    <div className="max-h-[400px] h-[400px] w-[800px] bg-white px-16 py-16 ">
      <div className="flex flex-col justify-between h-[300px] ">
        <div className="grid grid-cols-2 gap-x-4 gap-y-4">
          <Input
            placeholder="Name"
            onChange={handleCategoryFormChange}
            name="name"
            label="Name"
            value={formVal.name}
          />
          <Input
            placeholder="Description"
            onChange={handleCategoryFormChange}
            name="description"
            label="Description"
            value={formVal.description}
          />
          <div>
            <input
              onChange={handleCampaignPicture}
              accept="image/*"
              id="picture"
              hidden
              type="file"
            />
            <div>Upload image</div>
            <div className=" flex items-center gap-[10px]">
              {" "}
              <label
                className="flex mt-[10px] justify-center rounded-full items-center cursor-pointer bg-[#E8E8E8] w-[60px] h-[60px]"
                htmlFor="picture"
              >
                <div className="flex justify-center rounded-full min-h-[40px] max-h-[40px] min-w-[40px] max-w-[40px] border-[gray] items-center text-[40px]">
                  <PlusIcon />
                </div>
              </label>
              {imagePreview && (
                <div className="mt-4 flex justify-center items-center">
                  <img
                    src={imagePreview}
                    alt="Current Selected"
                    className="min-h-[60px] max-h-[60px] min-w-[60px] max-w-[60px] object-cover rounded-full"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-end justify-end">
          <Button label="Save" className="px-[4rem]" onClick={handleSave} />
        </div>
      </div>
    </div>
  );
}

export default CatagaryEditModal;
