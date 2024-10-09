import CatagaryModal from "@/components/CatagaryModal";
import Button from "@/components/common/button";
import Modal from "@/components/common/modal/modal";
import { useEffect, useState } from "react";
import {
  getAllCatagory,
  handelDeleteCategory,
} from "@/app/features/catagory/catagoryApi";
import ToastMessage from "@/components/common/toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import defaultimage from "/defaultimge.png";
import Loader from "@/components/common/Loader/Loader";

function Category() {
  const [isLoading, setIsLoading] = useState(false);
  const [showCatagaryModal, setShowCatagaryModal] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [allCatagory, setAllCatagory] = useState<any>([]);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const openCatagaryModal = () => {
    setIsEditMode(false);
    setShowCatagaryModal(true);
  };
  const closeCatagaryModal = () => setShowCatagaryModal(false);

  useEffect(() => {
    const fetchCatagory = async () => {
      try {
        setIsLoading(true);
        const response = await getAllCatagory();
        setAllCatagory(response);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch categories", error);
        setIsLoading(false);
      }
    };

    fetchCatagory();
  }, []);

  const handleNewCategory = (newCategory: any) => {
    setAllCatagory((prevCategories: any) => [...prevCategories, newCategory]);
  };

  const handleCategoryUpdated = async () => {
    try {
      setIsLoading(true);
      const response = await getAllCatagory();
      setAllCatagory(response);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch updated categories", error);
      setIsLoading(false);
    }
  };

  const handelDeleteUser = (id: any) => {
    setIsLoading(true);
    handelDeleteCategory(id)
      .then((res) => {
        setToast({
          type: "success",
          message: "Category deleted successfully!",
        });
        const filterCategory = allCatagory?.filter(
          (item: any) => item._id !== id
        );
        setAllCatagory(filterCategory);
        setIsLoading(false);
      })
      .catch((error) => {
        setToast({ type: "error", message: error.message });
        setIsLoading(false);
      });
  };

  return (
    <>
      <div className="relative">
        <Button
          variant="secondary"
          onClick={openCatagaryModal}
          label="Add Catagary"
        />
        <div className="pt-[4rem]">
          <div className="bg-white border border-gray-300 rounded-lg shadow-md">
            <div className="grid grid-cols-4 py-3 px-4 border-b border-gray-300 text-sm font-semibold text-gray-700">
              <span>Name</span>
              <span>Image</span>
              <span>Description</span>
              <span>Actions</span>
            </div>
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
                      // setShowCatagaryEditModal(true);
                      openCatagaryModal();
                      setIsEditMode(true);
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

        <Modal
          onModalClose={closeCatagaryModal}
          isModalOpen={showCatagaryModal}
        >
          <CatagaryModal
            closeCatagaryModal={closeCatagaryModal}
            onCategoryAdded={handleNewCategory}
            setToast={setToast}
            selectedCategoryId={selectedCategoryId}
            allCatagory={allCatagory}
            onCategoryUpdated={handleCategoryUpdated}
            isEditMode={isEditMode}
          />
        </Modal>
        <div className=" absolute  top-[-6rem]  right-0">
          {toast && (
            <ToastMessage
              type={toast.type}
              message={toast.message}
              onClose={() => setToast(null)}
            />
          )}
        </div>
      </div>
      {isLoading && <Loader />}
    </>
  );
}

export default Category;
