import UserPermission from "@/components/UserPermission";
import Button from "@/components/common/button";
import Modal from "@/components/common/modal/modal";
import React, { useState } from "react";

function RolePermission() {
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const openPermissionModal = () => {
    setShowPermissionModal(true);
  };
  const closePermissionModal = () => {
    setShowPermissionModal(false);
  };
  return (
    <div className="p-8">
      <div className="flex justify-end items-center gap-3">
        <h1 className="text-2xl font-bold mb-[0.5rem]">User Permission</h1>
        <Button variant="secondary" onClick={openPermissionModal} label="Add Permission" />
      </div>
      <Modal
        onModalClose={closePermissionModal}
        isModalOpen={showPermissionModal}
      >
        <UserPermission />
      </Modal>
    </div>
  );
}

export default RolePermission;
