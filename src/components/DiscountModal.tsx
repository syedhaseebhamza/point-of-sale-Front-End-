import { ChangeEvent, useEffect, useState } from "react";
import Input from "./common/inputField";
import Button from "./common/button";

const DiscountModal = ({
  discount,
  getDiscount,
  updateDiscount,
  closeDiscountModal,
  setToast,
}: any) => {
  const [newDiscount, setnewDiscount] = useState(discount);

  const handleDiscountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setnewDiscount(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await updateDiscount({
        newDiscount: Number(newDiscount),
      });
      getDiscount();
      setToast({
        type: "success",
        message: response?.message || "Discount updated successfully",
      });
    } catch (error: any) {
      setToast({
        type: "error",
        message: error.message || "An error occurred",
      });
    } finally {
      closeDiscountModal();
    }
  };

  return (
    <div>
      <div className="overflow-auto max-h-[500px] w-[800px] bg-white px-16 py-16 ">
        <div className="grid grid-cols-1 gap-y-4 pb-[1rem]">
          <Input
            value={newDiscount}
            type="number"
            name="discount"
            placeholder="Discount"
            label="Discount"
            onChange={handleDiscountChange}
          />
        </div>
        <div className="flex items-end justify-end ">
          <Button onClick={handleSubmit} label="Save" className="px-[4rem]" />
        </div>
      </div>
    </div>
  );
};

export default DiscountModal;
