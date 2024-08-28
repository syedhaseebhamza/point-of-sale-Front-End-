import React, { useState, ChangeEvent } from "react";
import Input from "./common/inputField";
import Button from "./common/button";
import { handelAddCatagory } from "@/app/features/catagory/catagoryApi";

function CatagaryModal({ closeCatagaryModal, onCategoryAdded }: any) {
  const [categoryValues, setCategoryValues] = useState({
    name: "",
    category: "",
    description: "",
  });
  const [campaignPicture, setCampaignPicture] = useState<File | null>(null);
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
    formData.append("category", categoryValues.category);
    formData.append("description", categoryValues.description);

    if (campaignPicture) {
      formData.append("image", campaignPicture);
    }

    try {
      const response = await handelAddCatagory(formData);
      onCategoryAdded(response.newCategory);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      closeCatagaryModal();
    }
  };

  const handleCampaignPicture = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setCampaignPicture(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="max-h-[400px] h-[400px] lg:w-[400px] lg:max-w-[400px] 2xl:w-[800px] 2xl:max-w-[800px] bg-white px-16 pt-20 pb-[25rem]">
      <div className="flex flex-col justify-between ">
        {" "}
        <div className="grid grid-cols-2 gap-x-4 gap-y-4">
          <Input
            placeholder="Name"
            onChange={handleCategoryFormChange}
            name="name"
            label="Name"
          />
          <Input
            onChange={handleCategoryFormChange}
            name="category"
            label="Catagary"
            placeholder="Catagary"
          />
          <Input
            placeholder="Description"
            onChange={handleCategoryFormChange}
            name="description"
            label="Description"
          />
          <div>
            <input
              onChange={handleCampaignPicture}
              accept="image/*"
              id="campaignPicture"
              hidden
              type="file"
            />

            <div>upload image</div>
            {imagePreview ? (
              <div className="min-h-[40px] max-h-[40px] min-w-[40px] max-w-[40px] mt-[13px]">
                <img
                  src={imagePreview}
                  alt="Selected"
                  className="min-h-[40px] max-h-[40px] min-w-[40px] max-w-[40px] object-cover rounded"
                />
              </div>
            ) : (
              <label
                className="flex mt-[10px] justify-center rounded-[8px] items-center cursor-pointer bg-[#E8E8E8] w-[60px] h-[60px]"
                htmlFor="campaignPicture"
              >
                <div className="flex justify-center border-2 min-h-[40px] max-h-[40px] min-w-[40px] max-w-[40px] border-[gray] items-center text-[40px]">
                  +
                </div>
              </label>
            )}
          </div>
        </div>
        <div className="flex items-end justify-end ">
          <Button onClick={handleSubmit} label="Save" className="px-[4rem]" />
        </div>
      </div>
    </div>
  );
}

export default CatagaryModal;
