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
function Catagary() {
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
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr>
              <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">
                Name
              </th>
              <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">
                Image
              </th>
              <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">
                Descriotion
              </th>
              <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {allCatagory?.map((item: any) => (
              <tr key={item._id}>
                <td className="py-2 px-4 border-b border-gray-300">
                  {item?.name}
                </td>
                <td className="py-2 px-4 border-b border-gray-300">
                  <img
                    className="border object-cover rounded-full h-20 w-20"
                    src={item?.image}
                    alt="img"
                  />
                </td>
                <td className="py-2 px-4 border-b border-gray-300">
                  {item?.description}
                </td>
                <td className="py-2 px-4 border-b border-gray-300">
                  <div className="flex items-center gap-[20px]">
                    <span>
                      <FontAwesomeIcon
                        className="cursor-pointer"
                        icon={faEdit}
                        onClick={() => {
                          setSelectedCategoryId(item._id);
                          setShowCatagaryEditModal(true);
                        }}
                      />
                    </span>
                    <span>
                      <FontAwesomeIcon
                        className="cursor-pointer"
                        icon={faTrash}
                        onClick={() => handelDeleteUser(item._id)}
                      />
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

export default Catagary;
