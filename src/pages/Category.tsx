import CatagaryModal from "@/components/CatagaryModal";
import Button from "@/components/common/button";
import Modal from "@/components/common/modal/modal";
import React, { useEffect, useState } from "react";
import {
  getAllCatagory,
  handelDeleteCategory,
} from "@/app/features/catagory/catagoryApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import CatagaryEditModal from "@/components/CatagaryEditModal";
import defaultimage from "/defaultimge.png"

function Category() {
  const [showCatagaryModal, setShowCatagaryModal] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [showCatagaryEditModal, setShowCatagaryEditModal] = useState(false);
  const [allCatagory, setAllCatagory] = useState<any>([]);
  const openCatagaryModal = () => setShowCatagaryModal(true);
  const closeCatagaryModal = () => setShowCatagaryModal(false);
  const closeCatagaryEditModal = () => setShowCatagaryEditModal(false);

  useEffect(() => {
    const fetchCatagory = async () => {
      try {
        const response = await getAllCatagory();
        console.log("respoce", response);

        setAllCatagory(response);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    fetchCatagory();
  }, []);

  const handleNewCategory = (newCategory: any) => {
    setAllCatagory((prevCategories: any) => [...prevCategories, newCategory]);
  };

  const handleCategoryUpdated = async () => {
    try {
      const response = await getAllCatagory();
      setAllCatagory(response);
    } catch (error) {
      console.error("Failed to fetch updated categories", error);
    }
  };

  const handelDeleteUser = (id: any) => {
    handelDeleteCategory(id).then((res) => {
      const filterCategory = allCatagory.filter((item: any) => item._id !== id);
      setAllCatagory(filterCategory);
    });
  };

  return (
    <div>
      <Button
        variant="secondary"
        onClick={openCatagaryModal}
        label="Add Catagary"
      />
      <div className="pt-[4rem]">
  <div className="bg-white border border-gray-300 rounded-lg shadow-md">
    {/* Header */}
    <div className="grid grid-cols-4 py-3 px-4 border-b border-gray-300 text-sm font-semibold text-gray-700">
      <span>Name</span>
      <span>Image</span>
      <span>Description</span>
      <span>Actions</span>
    </div>
    {/* Data Rows */}
    {allCatagory?.map((item: any) => (
      <div
        key={item._id}
        className="grid grid-cols-4 items-center py-2 px-4 border-b border-gray-300"
      >
        <span>{item?.name}</span>
        <div className="flex justify-start">
          <img
            className="border object-cover rounded-full h-20 w-20"
            src={item?.image || defaultimage}
            alt="img"
          />
        </div>
        <span>{item?.description}</span>
        <div className="flex items-center justify-start gap-4">
          <FontAwesomeIcon
            className="cursor-pointer"
            icon={faEdit}
            onClick={() => {
              setSelectedCategoryId(item._id);
              setShowCatagaryEditModal(true);
            }}
          />
          <FontAwesomeIcon
            className="cursor-pointer"
            icon={faTrash}
            onClick={() => handelDeleteUser(item._id)}
          />
        </div>
      </div>
    ))}
  </div>
</div>


      <Modal onModalClose={closeCatagaryModal} isModalOpen={showCatagaryModal}>
        <CatagaryModal
          closeCatagaryModal={closeCatagaryModal}
          onCategoryAdded={handleNewCategory}
        />
      </Modal>
      <Modal
        onModalClose={closeCatagaryEditModal}
        isModalOpen={showCatagaryEditModal}
      >
        <CatagaryEditModal
          selectedCategoryId={selectedCategoryId}
          allCatagory={allCatagory}
          closeCatagaryEditModal={closeCatagaryEditModal}
          onCategoryUpdated={handleCategoryUpdated}
        />
      </Modal>
    </div>
  );
}

export default Category;
