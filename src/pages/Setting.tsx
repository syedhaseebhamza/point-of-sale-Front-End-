import { useEffect, useState } from "react";
import Card from "@/components/common/cards";
import {
  getAllDiscount,
  handelUpdateDiscount,
} from "@/app/features/discount/discountApi";
import ToastMessage from "@/components/common/toast";
import DiscountModal from "@/components/DiscountModal";
import Modal from "@/components/common/modal/modal";

const Setting = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [discount, setDiscount] = useState(null);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const settingHeader = [{ id: 1, name: "Discount", icon: "" }];

  const getDiscount = async () => {
    const response = await getAllDiscount();
    setDiscount(response.discount);
  };

  const updateDiscount = async (data: any) => {
    const response = await handelUpdateDiscount(data);
    setToast({
      type: "success",
      message: response.message || "Draft Item Updated successfully!",
    });
  };

  useEffect(() => {
    getDiscount();
  }, []);

  const handleCardClick = (id: any) => {
    setActiveModal(id);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <>
      <div className="grid grid-cols-7 gap-x-4 gap-y-4 w-full">
        {settingHeader.map((head) => (
          <div key={head.id}>
            <Card
              image={head.icon || "/default-image.jpg"}
              name={head.name}
              onClick={() => handleCardClick(head.id)}
            />
          </div>
        ))}
      </div>

      {activeModal === 1 && (
        <Modal onModalClose={closeModal} isModalOpen={activeModal === 1}>
          <DiscountModal discount={discount} getDiscount={getDiscount} updateDiscount={updateDiscount}  closeDiscountModal={closeModal} setToast={setToast} />
        </Modal>
      )}

      <div className=" absolute  top-[6rem]  right-0">
        {toast && (
          <ToastMessage
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </>
  );
};

export default Setting;
