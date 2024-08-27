import React, { useState } from "react";
import Input from "./common/inputField";
import Button from "./common/button";
import { handelAddCatagory } from "@/app/features/catagory/catagoryApi";

function CatagaryModal({ closeCatagaryModal, onCategoryAdded }: any) {
  const [categoryValues, setCategoryValues] = useState({
    name: "",
    category: "",
    description: "",
  });

  const handleCategoryFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCategoryValues({
      ...categoryValues,
      [name]: value,
    });
  };
  const handleSubmit = async () => {
    try {
      const response = await handelAddCatagory(categoryValues);
      onCategoryAdded(response.newcategory);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      closeCatagaryModal();
    }
  };

  return (
    <div className="max-h-[400px] h-[400px] lg:w-[400px] lg:max-w-[400px] 2xl:w-[800px] 2xl:max-w-[800px] bg-white px-16 pt-20 pb-[25rem]">
      <div className="grid grid-cols-2 gap-x-4 gap-y-4">
        <Input onChange={handleCategoryFormChange} name="name" label="Name" />
        <Input
          onChange={handleCategoryFormChange}
          name="category"
          label="Catagary"
        />
        <Input
          onChange={handleCategoryFormChange}
          name="description"
          label="Description"
        />
      </div>
      <div className="flex items-end justify-end ">
        <Button onClick={handleSubmit} label="Save" className="px-[4rem]" />
      </div>
    </div>
  );
}

export default CatagaryModal;
