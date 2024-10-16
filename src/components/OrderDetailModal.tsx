import React from "react";

interface DataModalProps {
  isOpen: boolean;
  setIsModalOpen: any;
  orderProduct: any;
  orderID: any;
  totalBill: any;
}

const calculateDiscount = (price: number): number => {
  const discountPercentage = 0.1;
  return price - price * discountPercentage;
};

const OrderDetailModal: React.FC<DataModalProps> = ({
  isOpen,
  setIsModalOpen,
  orderProduct,
  orderID,
  totalBill,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-20">
      <div className="bg-white rounded-lg shadow-xl w-11/12 md:w-3/4 lg:w-1/2 p-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 rounded-full w-10 h-10 flex items-center justify-center text-2xl"
          onClick={() => {
            setIsModalOpen(false);
          }}
        >
          &times;
        </button>
        <h2 className="text-lg font-bold mb-4">Order ID: {orderID}</h2>
        <div className="max-h-64 overflow-y-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-primary text-white">
                <th className="border px-4 py-2">Sr No</th>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Variant</th>
                <th className="border px-4 py-2">Qunatity</th>
                <th className="border px-4 py-2">Price</th>
                <th className="border px-4 py-2">Total Price</th>
              </tr>
            </thead>
            <tbody>
              {orderProduct.map((item: any, index: any) => (
                <tr key={item._id}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{item.productName}</td>
                  <td className="border px-4 py-2">{item.variants || "N/A"}</td>
                  <td className="border px-4 py-2">{item.productQuantity}</td>
                  <td className="border px-4 py-2">
                    {calculateDiscount(item.productPrice)}
                  </td>
                  <td className="border px-4 py-2">
                    {calculateDiscount(
                      item.productPrice * item.productQuantity
                    )}
                  </td>
                </tr>
              ))}
              <tr>
                <td
                  colSpan={7}
                  className="border px-4 py-2 text-lg font-bold text-center"
                >
                  Total Bill: {totalBill}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
