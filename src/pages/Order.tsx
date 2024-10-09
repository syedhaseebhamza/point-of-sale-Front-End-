import { fetchPlaceOrder } from "@/app/features/sales/salesApi";
import Loader from "@/components/common/Loader/Loader";
import { useEffect, useState } from "react";

function Order() {
  const [orders, setOrders] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await fetchPlaceOrder();
        const filterData = response.orders.flatMap(
          (item: any) => item.productData
        );
        setOrders(filterData);
        setIsLoading(true);
      } catch (error) {
        console.error("Failed to fetch orders", error);
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <>
      <div className="relative mt-10 overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Sr No
              </th>
              <th scope="col" className="px-6 py-3">
                Order
              </th>
              <th scope="col" className="px-6 py-3">
                Varient
              </th>
              <th scope="col" className="px-6 py-3">
                Quantity
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((item: any, index: number) => (
              <tr key={index}>
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {item.productName}
                </td>
                <td className="px-6 py-4">{item.variants}</td>
                <td className="px-6 py-4">{item.productQuantity}</td>
                <td className="px-6 py-4">Rs {item.productPrice}</td>
                <td className="px-6 py-4">
                  Rs {item.productQuantity * item.productPrice}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isLoading && <Loader />}
    </>
  );
}

export default Order;
