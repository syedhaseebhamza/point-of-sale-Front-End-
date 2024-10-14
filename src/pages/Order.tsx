import { fetchPlaceOrder } from "@/app/features/sales/salesApi";
import Loader from "@/components/common/Loader/Loader";
import { useEffect, useState } from "react";
import IosShareIcon from "@mui/icons-material/IosShare";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

function Order() {
  const [orders, setOrders] = useState<any>([]);
  const [exports, setExports] = useState<any>([]);
  const [totalSale, setTotalSale] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const fetchOrders = async (page: number) => {
    try {
      setIsLoading(true);
      const startDate = new Date(selectedDate);
      startDate.setUTCHours(0, 0, 0, 0);

      const endDate = new Date(startDate);
      endDate.setUTCHours(23, 59, 59, 999);

      const response = await fetchPlaceOrder(undefined, selectedDate, page);
      setIsLoading(true);
      setOrders(response.orders);
      setExports(response.forExport);
      setTotalSale(response.totalSale);
      setTotalPages(response.totalPages);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch orders", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage, selectedDate]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
    setCurrentPage(1);
  };

  const applyDiscount = (price: any) => {
    const discountRate = 0.1;
    const discountedPrice = price * (1 - discountRate);
    return discountedPrice.toFixed(2);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 4;
    let startPage, endPage;

    if (totalPages <= maxVisiblePages) {
      startPage = 1;
      endPage = totalPages;
    } else {
      startPage = Math.max(1, currentPage - 1);
      endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-1 rounded ${
            currentPage === i ? "bg-primary text-white" : "bg-gray-200"
          }`}
        >
          {i}
        </button>
      );
    }

    return pageNumbers;
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Order Details", 14, 22);

    doc.setFontSize(12);
    doc.text(`Date: ${selectedDate}`, 14, 30);
    doc.text(`Total Sale: Rs ${totalSale}`, 14, 36);

    const tableData = exports.map((item: any, index: number) => [
      index + 1 + (currentPage - 1) * 10,
      item.productName,
      item.variants || "N/A",
      item.productQuantity,
      `Rs ${applyDiscount(item.productPrice)}`,
      `Rs ${applyDiscount(item.productQuantity * item.productPrice)}`,
    ]);

    // @ts-ignore
    (doc as any).autoTable({
      head: [["Sr No", "Order", "Variant", "Quantity", "Price", "Total"]],
      body: tableData,
      startY: 45,
      headStyles: {
        fillColor: [246, 127, 32],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
    });

    doc.save("order_details.pdf");
  };

  return (
    <>
      <div className="flex justify-end mt-2 mb-2">
        <button
          onClick={exportToPDF}
          className="flex items-center px-4 py-2 bg-primary text-white rounded transition duration-200"
        >
          <IosShareIcon className="mr-2" />
          Export PDF
        </button>
      </div>
      <div className="flex flex-col gap-7 sm:flex-row justify-around">
        <div className="bg-white mx-auto p-6 rounded-lg shadow-md w-full max-w-xs">
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700"
          >
            Select Date
          </label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
          />
        </div>
        <div className="bg-white mx-auto p-6 rounded-lg shadow-md w-full max-w-xs">
          <h5 className="text-center uppercase font-semibold">Total Sale</h5>
          <p className="text-center mt-4">Rs {totalSale}</p>
        </div>
      </div>
      <div className="relative mt-10 overflow-x-auto overflow-y-auto min-h-[10rem] max-h-full">
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
                Variant
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
            {orders.length > 0
              ? orders.map((item: any, index: number) => (
                  <tr key={index}>
                    <td className="px-6 py-4">
                      {index + 1 + (currentPage - 1) * 10}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {item.productName}
                    </td>
                    <td className="px-6 py-4">{item.variants || "N/A"}</td>
                    <td className="px-6 py-4">{item.productQuantity}</td>
                    <td className="px-6 py-4">
                      Rs {applyDiscount(item.productPrice)}
                    </td>
                    <td className="px-6 py-4">
                      Rs{" "}
                      {applyDiscount(item.productQuantity * item.productPrice)}
                    </td>
                  </tr>
                ))
              : !isLoading && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No orders placed on this date.
                    </td>
                  </tr>
                )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between p-4">
        <div className="text-[14px] mt-2 font-bold leading-[19.5px]">
          Showing {currentPage}-{10} of {totalPages} Entries
        </div>

        <div className="flex items-center justify-center space-x-4 mt-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2  bg-primary text-white rounded disabled:bg-gray-300"
          >
            Prev
          </button>

          <div className="flex space-x-2">{renderPageNumbers()}</div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-primary text-white rounded disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>
      {isLoading && <Loader />}
    </>
  );
}

export default Order;
