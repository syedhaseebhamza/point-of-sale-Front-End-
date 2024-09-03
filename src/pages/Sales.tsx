import { getAllItem } from "@/app/features/Item/itemApi";
import { getAllCatagory } from "@/app/features/catagory/catagoryApi";
import SalesModal from "@/components/SalesModal";
import Button from "@/components/common/button";
import Modal from "@/components/common/modal/modal";
import React, { useEffect, useState } from "react";

function Sales() {
  const [catagory, setCatagory] = useState([]);
  const [items, setItems] = useState<any>([]);
  const [showSalesModal, setShowSalesModal] = useState(false);
  const openSalesModal = () => setShowSalesModal(true);
  const closeSalesModal = () => setShowSalesModal(false);

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
  return (
    <div>
      <Button label="Add Sales" variant="secondary" onClick={openSalesModal} />
      <Modal onModalClose={closeSalesModal} isModalOpen={showSalesModal}>
        <SalesModal catagory={catagory} items={items} />
      </Modal>
    </div>
  );
}

export default Sales;
