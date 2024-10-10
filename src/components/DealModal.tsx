import React, { ChangeEvent, useEffect, useState } from "react";
import Input from "./common/inputField";
import Button from "./common/button";
import {
  handelAddNewDeals,
  handelUpdateDeals,
} from "@/app/features/deal/dealApi";
import { MinusIcon, PlusIcon } from "./ui-icons";
import Loader from "./common/Loader/Loader";

function DealModal({
  catagory,
  onItemAdded,
  closeItemModal,
  setToast,
  selectedDealId,
  items,
  deals,
  onItemUpdated,
  isEditMode,
  isModalLoading
}: any) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedCatagoryId, setSelectedCatagoryId] = useState("");
  const [itemPicture, setItemPicture] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [products, setProducts] = useState([
    { productId: "", productQuantity: "", salePrice: "" },
  ]);
  const [formValues, setFormValues] = useState({
    categoryName: selectedValue,
    name: "",
    retailPrice: "0",
  });
  const [isOpenCategory, setIsOpenCategory] = useState(false);
  const [openItemDropdownIndex, setOpenItemDropdownIndex] = useState<number | null>(null);

  const toggleDropdownCategory = () => {
    setIsOpenCategory((prev) => !prev);
  };

  const toggleDropdownItem = (index: number) => {
    setOpenItemDropdownIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleSelectCategoryValue = (value: string, id: any) => {
    setSelectedCatagoryId(id);
    setSelectedValue(value);
    setFormValues((prevValues) => ({
      ...prevValues,
      categoryName: value,
    }));
    setIsOpenCategory(false);
  };

  const handleSelectItemValue = (value: string, id: any, index: number) => {
    const updatedProducts = [...products];
    updatedProducts[index].productId = id;
    setProducts(updatedProducts);
    setOpenItemDropdownIndex(null);
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
    const newValue = name === "retailPrice" ? (value ? parseFloat(value) : "") : value;
    setFormValues({
      ...formValues,
      [name]: newValue,
    });
  };

  const handleProductChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const newProducts = [...products];
    newProducts[index] = {
      ...newProducts[index],
      [name]: value,
    };
    setProducts(newProducts);
  };

  const handleAddProducts = () => {
    setProducts([
      ...products,
      { productId: "", productQuantity: "", salePrice: "" },
    ]);
  };

  const handleRemoveItems = (index: number) => {
    const newProducts = products.filter((_, i) => i !== index);
    setProducts(newProducts);
  };

  const handleAddDetailFunction = () => {
    return {
      categoryId: selectedCatagoryId,
      categoryName: formValues?.categoryName,
      name: formValues.name,
      image: imagePreview,
      products: products.map((product) => ({
        productId: product.productId,
        productQuantity: Number(product.productQuantity),
        salePrice: parseFloat(product.salePrice),
      })),
    };
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      const formData = new FormData();
      const data = handleAddDetailFunction();
  
      formData.append("categoryId", data.categoryId);
      formData.append("categoryName", data?.categoryName);
      formData.append("name", data.name);
      formData.append("retailPrice", formValues.retailPrice);
      formData.append("products", JSON.stringify(data.products));

      if (itemPicture) {
        formData.append("image", itemPicture);
      }
      const response = await handelAddNewDeals(formData, selectedCatagoryId);
      if (response.message === "Deal created successfully") {
        onItemAdded(response.newDeal);
      } else {
        onItemAdded(response.deals);
      }
      setIsLoading(false)

      setToast({
        type: "success",
        message: "Deal added successfully",
      });
    } catch (error: any) {
      console.error("Error:", error);
      setIsLoading(false)
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
    const data = handleAddDetailFunction();

    formData.append("categoryId", data.categoryId);
    formData.append("categoryName", data.categoryName);
    formData.append("name", data.name);
    formData.append("retailPrice", formValues.retailPrice);
    formData.append("products", JSON.stringify(data.products));

    if (itemPicture) {
      formData.append("image", itemPicture);
    }
    try {
      await handelUpdateDeals(formData, selectedDealId);

      setToast({
        type: "success",
        message: "Deal updated successfully",
      });

      closeItemModal();
      onItemUpdated();
    } catch (error: any) {
      console.error("Error updating item:", error);
      setToast({
        type: "error",
        message: "Failed to update deal.",
      });
    }
  };

  useEffect(() => {
    if (isEditMode && selectedDealId) {
      const selectedItem = deals.find(
        (deals: any) => deals._id === selectedDealId
      );
      if (selectedItem) {
        setFormValues({
          categoryName: selectedItem.categoryName,
          name: selectedItem.name,
          retailPrice: selectedItem.retailPrice,
        });
        setImagePreview(selectedItem.image || null);
        setSelectedCatagoryId(selectedItem.categoryId);
        setSelectedValue(selectedItem.categoryName);
        setProducts(selectedItem.products.map((prod: any) => ({
          productId: prod.productId,
          productQuantity: prod.productQuantity,
          salePrice: prod.salePrice,
        })));
      }
    }
  }, [isEditMode, selectedDealId, items]);

  return (
    <>
      <div className="overflow-auto max-h-[500px] w-[800px] bg-white px-16 py-16 relative">
        <div className=" grid grid-cols-2 gap-x-4 gap-y-4 pb-[1rem]">
          <div className="relative">
            <div className="text-[black] mb-4 text-[14px]">Category</div>
            <button
              type="button"
              onClick={toggleDropdownCategory}
              className="inline-flex justify-between w-full px-3 py-[13px] text-sm font-medium text-gray-700 bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
            >
              <span className="mr-2">{selectedValue || "Select Category"}</span>
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

            {isOpenCategory && (
              <div className="absolute z-10 h-[10rem] overflow-auto top-[60px] w-full mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-1 space-y-1">
                {catagory?.map((option: any) => (
                  <button
                    key={option._id}
                    type="button"
                    onClick={() =>
                      handleSelectCategoryValue(option.name, option._id)
                    }
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    {option.name}
                  </button>
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
            placeholder="Retail Price"
            label="Retail Price"
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

            <div className="mb-2">Upload Image</div>
            {imagePreview ? (
              <div className="flex justify-center items-center w-16 h-16 mt-2 border border-gray-300 rounded-full">
                <img
                  src={imagePreview}
                  alt="Selected"
                  className="w-12 h-12 object-cover rounded-full"
                />
              </div>
            ) : (
              <label
                className="flex justify-center items-center cursor-pointer bg-gray-200 w-16 h-16 mt-2 rounded-full"
                htmlFor="itemPicture"
              >
                <PlusIcon />
              </label>
            )}
          </div>
        </div>
        <div className="flex flex-col border-t-2 pt-4">
          <div className="flex justify-between items-center mb-4">
          <div className="text-[20px] font-medium ">Products</div>
            <button
              type="button"
              onClick={handleAddProducts}
              className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full"
            >
              <PlusIcon />
            </button>
          </div>

          {products.map((product, index) => (
            <div key={index} className="flex items-center space-x-3 mb-4 relative">
              {/* Item Dropdown */}
              <div className="relative flex-1">
              <div className="text-[black] mb-4 text-[14px]">Items</div>
                <button
                  type="button"
                  onClick={() => toggleDropdownItem(index)}
                  className="w-full px-3 py-[13px] text-left text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <span>
                    {product.productId
                      ? items.find((item: any) => item._id === product.productId)?.name
                      : "Select Item"}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 float-right"
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
                {openItemDropdownIndex === index && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-auto">
                    {items?.map((option: any) => (
                      <button
                        key={option._id}
                        type="button"
                        onClick={() =>
                          handleSelectItemValue(option.name, option._id, index)
                        }
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        {option.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Quantity Input */}
              <Input
                name="productQuantity"
                placeholder="Quantity"
                label="Quantity"
                type="number"
                value={product.productQuantity}
                onChange={(e) => handleProductChange(index, e)}
              />

              <Input
                name="salePrice"
                type="number"
                placeholder="Sale Price"
                label="Sale Price"
                value={product.salePrice}
                onChange={(e) => handleProductChange(index, e)}
              />

              {products.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveItems(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <MinusIcon />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <Button
            onClick={isEditMode ? handleSave : handleSubmit}
            label="Save"
            className="px-8 py-2"
          />
        </div>
      </div>
      {isModalLoading && <Loader />}
    </>
  );
}

export default DealModal;
