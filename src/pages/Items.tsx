import ItemModal from "@/components/ItemModal";
import Button from "@/components/common/button";
import Modal from "@/components/common/modal/modal";
import React, { useState } from "react";

function Items() {
  const [showItemModal, setShowItemModal] = useState(false);
  const openItemModal = () => setShowItemModal(true);
  const closeItemModal = () => setShowItemModal(false);
  return (
    <div>
      <Button variant="dark_hover" onClick={openItemModal} label="Add Item" />
      <Modal onModalClose={closeItemModal} isModalOpen={showItemModal}>
        <ItemModal />
      </Modal>
    </div>
  );
}

export default Items;
