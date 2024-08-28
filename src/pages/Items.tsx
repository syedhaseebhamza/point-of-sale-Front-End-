import ItemModal from "@/components/ItemModal";
import Button from "@/components/common/button";
import Modal from "@/components/common/modal/modal";
import React, { useEffect, useState } from "react";
import { getAllCatagory } from "@/app/features/catagory/catagoryApi";
import { getAllItem } from "@/app/features/Item/itemApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
function Items() {
  const [showItemModal, setShowItemModal] = useState(false);
  const [catagory, setCatagory] = useState([]);
  const [items, setItems] = useState<any>([]);
  const openItemModal = () => setShowItemModal(true);
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

  const handelAddItem = (newItem: any) => {
    setItems((prevItem: any) => [...prevItem, newItem]);
  };

  return (
    <div>
      <Button variant="dark_hover" onClick={openItemModal} label="Add Item" />
      <div className="pt-[4rem]">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr>
              <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">
                Catagory Name
              </th>

              <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">
                Reail Price
              </th>
              <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">
                Sale Price
              </th>
              <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">
                Discount
              </th>
              <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">
                Size
              </th>
              <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {items?.map((item: any) => (
              <tr key={item._id}>
                <td className="py-2 px-4 border-b border-gray-300">
                  {item?.categoryName}
                </td>

                <td className="py-2 px-4 border-b border-gray-300">
                  {item?.retailPrice} Rs
                </td>
                <td className="py-2 px-4 border-b border-gray-300">
                  {item?.salePrice} Rs
                </td>
                <td className="py-2 px-4 border-b border-gray-300">
                  {item?.discount} Rs
                </td>
                <td className="py-2 px-4 border-b border-gray-300">
                  {item?.size}
                </td>
                <td className="py-2 px-4 border-b border-gray-300">
                  <div className="flex items-center gap-[20px]">
                    <span>
                      <FontAwesomeIcon
                        className="cursor-pointer"
                        icon={faEdit}
                        // onClick={() => {
                        //   setSelectedUserId(user._id);
                        //   setShowEditUSerModal(true);
                        // }}
                      />
                    </span>
                    <span>
                      <FontAwesomeIcon
                        className="cursor-pointer"
                        icon={faTrash}
                        // onClick={() => handelDeleteUser(item._id)}
                      />
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal onModalClose={closeItemModal} isModalOpen={showItemModal}>
        <ItemModal
          closeItemModal={closeItemModal}
          catagory={catagory}
          onItemAdded={handelAddItem}
        />
      </Modal>
    </div>
  );
}

export default Items;
