import ItemModal from "@/components/ItemModal";
import Button from "@/components/common/button";
import Modal from "@/components/common/modal/modal";
import React, { useEffect, useState } from "react";
import { getAllCatagory } from "@/app/features/catagory/catagoryApi";
import { getAllItem, handelDeleteItem } from "@/app/features/Item/itemApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import ToastMessage from "@/components/common/toast";
import defaultimage from "/defaultimge.png";

const headers = [
  { label: "Category Name", key: "categoryName" },
  { label: "Product Name", key: "name" },
  { label: "Product Image", key: "image" },
  { label: "Retail Price", key: "retailPrice" },
  { label: "Size", key: "size" },
  { label: "Sale Price", key: "salePrice" },
  { label: "Actions", key: "actions" },
];

const actions = [
  { icon: faEdit, action: "edit" },
  { icon: faTrash, action: "delete" },
];

function Items() {
  const [showItemModal, setShowItemModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [isEditModa, setIsEditModa] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [catagory, setCatagory] = useState([]);
  const [items, setItems] = useState<any>([]);
  const openItemModal = () => {
    setIsEditModa(false);
    setSelectedItemId("");
    setShowItemModal(true);
  };

  const openItemEditModal = (itemId: string) => {
    setSelectedItemId(itemId);
    setIsEditModa(true);
    setShowItemModal(true);
  };

  const closeItemModal = () => setShowItemModal(false);
  useEffect(() => {
    const fetchCatagory = async () => {
      try {
        const response = await getAllCatagory();
        setCatagory(response);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    fetchCatagory();
  }, []);
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await getAllItem();
        setItems(response);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    fetchItems();
  }, []);

  const handelUpdateItem = async () => {
    try {
      const responce = await getAllItem();
      setItems(responce);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  const handelAddItem = (newItem: any) => {
    setItems((prevItem: any) => [...prevItem, newItem]);
  };
  const handelDeleteUser = (id: any) => {
    handelDeleteItem(id)
      .then((res) => {
        const filterItem = items.filter((item: any) => item._id !== id);
        setItems(filterItem);
        setToast({
          type: "success",
          message: "Item deleted successfully!",
        });
      })
      .catch((error) => {
        setToast({
          type: "error",
          message: error.message,
        });
      });
  };
  return (
    <div className="relative">
      <Button variant="secondary" onClick={openItemModal} label="Add Item" />
      <div className="pt-[4rem]">
        <div className="bg-white border border-gray-300 rounded-lg shadow-md">
          <div className="border-b border-gray-300 p-4 flex justify-between font-semibold text-gray-700">
            {headers.map((header) => (
              <div key={header.key} className="w-1/6">
                {header.label}
              </div>
            ))}
          </div>
          {items?.map((item: any) => (
            <div
              key={item._id}
              className="border-b border-gray-300 p-4 flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              {headers?.slice(0, -1)?.map((header) => (
                <div key={header.key} className="w-1/6 text-gray-700">
                  {header.key === "size" ? (
                    <div>
                      {item.variants.map((variant: any) => (
                        <div key={variant._id}>{variant?.size}</div>
                      ))}
                    </div>
                  ) : header.key === "salePrice" ? (
                    <div>
                      {item.variants.map((variant: any) => (
                        <div key={variant._id}>{variant?.price} (Rs)</div>
                      ))}
                    </div>
                  ) : header.key === "image" ? (
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
                        onClick={() => handelDeleteUser(item._id)}
                      />
                    </span>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal onModalClose={closeItemModal} isModalOpen={showItemModal}>
        <ItemModal
          closeItemModal={closeItemModal}
          catagory={catagory}
          onItemAdded={handelAddItem}
          setToast={setToast}
          selectedItemId={selectedItemId}
          items={items}
          onItemUpdated={handelUpdateItem}
          isEditModa={isEditModa}
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
  );
}

export default Items;
