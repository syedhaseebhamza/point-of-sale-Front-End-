import Button from "@/components/common/button";
import Modal from "@/components/common/modal/modal";
import { useEffect, useState } from "react";
import { getAllCatagory } from "@/app/features/catagory/catagoryApi";
import { getAllDeals, handelDeleteDeals } from "@/app/features/deal/dealApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import ToastMessage from "@/components/common/toast";
import defaultimage from "/defaultimge.png";
import Loader from "@/components/common/Loader/Loader";
import DealModal from "@/components/DealModal";
import { getAllItem } from "@/app/features/Item/itemApi";

function Deals() {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [showDealModal, setShowDealModal] = useState(false);
  const [selectedDealId, setSelectedDealId] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [items, setItems] = useState();
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [catagory, setCatagory] = useState([]);
  const [deals, setdeals] = useState<any>([]);
  const openItemModal = () => {
    setIsEditMode(false);
    setSelectedDealId("");
    setShowDealModal(true);
  };

  const openItemEditModal = (itemId: string) => {
    setSelectedDealId(itemId);
    setIsEditMode(true);
    setShowDealModal(true);
  };

  const closeItemModal = async () => setShowDealModal(false)

  const fetchCatagory = async () => {
    try {
      setIsLoading(true);
      const response = await getAllCatagory();
      setCatagory(response);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch categories", error);
      setIsLoading(false);
    }
  };

  const fetchDeals = async () => {
    try {
      setIsLoading(true);
      const response = await getAllDeals();
      setdeals(response.deals);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch categories", error);
      setIsLoading(false);
    }
  };

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const response = await getAllItem();
      setItems(response);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch categories", error);
      setIsLoading(false);
    }
  };

  const handelUpdateDeal = async () => {
    try {
      setIsLoading(true);
      const responce = await getAllDeals();
      setdeals(responce.deals);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch Deals", error);
      setIsLoading(false);
    }
  };

  const handelAddItem = (newItem: any) => {
    setdeals((prevItem: any) => [...prevItem, newItem]);
  };
  const handelDeleteDeal = (id: any) => {
    setIsLoading(true);
    handelDeleteDeals(id)
      .then((res) => {
        const filterItem = deals.filter((item: any) => item._id !== id);
        setdeals(filterItem);
        setIsLoading(false);
        setToast({
          type: "success",
          message: "Deal deleted successfully!",
        });
      })
      .catch((error) => {
        setIsLoading(false);
        setToast({
          type: "error",
          message: error.message,
        });
      });
  };

  useEffect(() => {
    fetchCatagory();
    fetchDeals();
    fetchItems();
  }, []);

  const headers = [
    { label: "Category Name", key: "categoryName" },
    { label: "Deal Name", key: "name" },
    { label: "Deal Image", key: "image" },
    { label: "Total Price", key: "totalPrice" },
    { label: "Actions", key: "actions" },
  ];

  const actions = [
    { icon: faEdit, action: "edit" },
    { icon: faTrash, action: "delete" },
  ];
  return (
    <>
      <div className="relative">
        <Button
          variant="secondary"
          onClick={openItemModal}
          label="Add Deals Item"
        />
        <div className="pt-[4rem]">
          <div className="bg-white border border-gray-300 rounded-lg shadow-md">
            <div className="border-b border-gray-300 p-4 flex justify-between font-semibold text-gray-700">
              {headers &&
                headers?.map((header) => (
                  <div key={header.key} className="w-1/6">
                    {header.label}
                  </div>
                ))}
            </div>
            {!isModalLoading &&
              deals?.map((item: any) => (
                <div
                  key={item._id}
                  className="border-b border-gray-300 p-4 flex flex-col md:flex-row justify-between items-start md:items-center"
                >
                  {headers?.slice(0, -1)?.map((header) => (
                    <div key={header.key} className="w-1/6 text-gray-700">
                      {header.key === "image" ? (
                        <div className="flex justify-start">
                          <img
                            className="border object-cover rounded-full h-20 w-20"
                            src={item?.image || defaultimage}
                            alt="img"
                          />{" "}
                        </div>
                      ) : (
                        item[header.key] || ""
                      )}
                    </div>
                  ))}
                  <div className="w-1/6 flex items-center gap-4">
                    {actions.map((action) =>
                      action.action === "edit" ? (
                        <span key={action.action}>
                          <FontAwesomeIcon
                            className="cursor-pointer"
                            icon={action.icon}
                            onClick={() => openItemEditModal(item._id)}
                          />
                        </span>
                      ) : (
                        <span key={action.action}>
                          <FontAwesomeIcon
                            className="cursor-pointer"
                            icon={action.icon}
                            onClick={() => handelDeleteDeal(item._id)}
                          />
                        </span>
                      )
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
        <Modal onModalClose={closeItemModal} isModalOpen={showDealModal}>
          <DealModal
            closeItemModal={closeItemModal}
            catagory={catagory}
            onItemAdded={handelAddItem}
            setToast={setToast}
            selectedDealId={selectedDealId}
            items={items}
            deals={deals}
            onItemUpdated={handelUpdateDeal}
            isEditMode={isEditMode}
            isModalLoading={isModalLoading}
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

export default Deals;
