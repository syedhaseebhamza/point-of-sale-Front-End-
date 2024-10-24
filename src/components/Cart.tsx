import { useEffect, useState } from "react";
import {
  handelPlaceOrder,
  handelFetchAllDraftItem,
  handelDeleteOrder,
  handelUpdateOrder,
} from "@/app/features/sales/salesApi";
import Button from "@/components/common/button";
import default2 from "../Images/default_rectangle.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import ToastMessage from "./common/toast";
import { generatePDFReceipt } from "@/utils/receiptUtils";
import { getAllDiscount } from "@/app/features/discount/discountApi";

const Cart = ({
  fetchItems,
  selectedItems,
  setSelectedItems,
  setItems,
  setSelectedSizes,
  setSelectedDraftItem,
  selectedDraftItem,
  items,
}: any) => {
  const [totalPrice, setTotalPrice] = useState<any>();
  const [activeTab, setActiveTab] = useState("newOrderBill");
  const [isDraftItemSelected, setIsDraftItemSelected] = useState(false);
  const [draftItem, setDraftItem] = useState<any>([]);
  const [discountValue, setDiscountValue] = useState(0);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const getDiscount = async () => {
    const response = await getAllDiscount();
    setDiscountValue(response.discount);
  };

  const transformedProductData = selectedItems.map((item: any) => ({
    isDeleted: false,
    productId: item._id,
    productName: item.name,
    productPrice: item.price,
    productQuantity: item.quantity,
    variants: item.selectedSizes[0] || item.selectedSizes[""],
  }));

  const transformedProductCategory = selectedItems.map((item: any) => ({
    categoryId: item.categoryId,
  }));

  const clearall = () => {
    setSelectedDraftItem((prevState: any) => ({
      ...prevState,
      productData: [],
    }));
  };

  const handleDraftTab = async () => {
    try {
      if (selectedItems && selectedItems.length > 0) {
        await handlePlaceOrder(true);
      }
      const response = await handelFetchAllDraftItem(true);
      setDraftItem(response.orders);
      setActiveTab("draft");
    } catch (error) {
      console.error("Failed to Fetched Draft Order", error);
    }
  };

  const formatDate = (dateString: any) => {
    return new Date(dateString).toLocaleString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleRemoveFromOrder = (itemId: string) => {
    setSelectedItems((prevItems: any) => {
      return prevItems.filter((item: any) => item._id !== itemId);
    });
  };

  const DeleteOrders = (id: any) => {
    handelDeleteOrder(id)
      .then((res) => {
        const filterItem = items.filter((item: any) => item._id !== id);
        setItems(filterItem);
      })
      .catch((error) => {
        setToast({
          type: "error",
          message: error.message,
        });
      });
  };

  const calculateSubtotal = (items: any[], isDraft = false) => {
    return items?.reduce((total: number, item: any) => {
      const price = isDraft ? item.productPrice : item.price;
      const quantity = isDraft ? item.productQuantity : item.quantity;
      return total + (price || 0) * quantity;
    }, 0);
  };

  const calculateDiscount = (items: any[], isDraft = false) => {
    return items?.reduce((total: number, item: any) => {
      const price = isDraft ? item.productPrice : item.price;
      const quantity = isDraft ? item.productQuantity : item.quantity;
      return total - (price || 0) * quantity;
    }, 0);
  };

  const handlePlaceOrder = async (isDraft: boolean) => {
    const totalOrderPrice = selectedItems?.reduce(
      (total: number, item: any) => {
        return total + item.price * item.quantity;
      },
      0
    );

    const discount = totalOrderPrice * 0.1;

    const data = {
      categoryData: selectedItems.map((item: any) => ({
        categoryId: item.categoryId,
      })),
      productData: selectedItems.map((item: any) => ({
        productId: item._id,
        productName: item.name,
        productPrice: item.price,
        productQuantity: item.quantity,
        variants: item.selectedSizes[0],
      })),
      discount: discount,
      totalPrice: totalOrderPrice - discount,
      isDraft,
    };
    if (isDraftItemSelected && isDraft === false) {
      const draftData = {
        Date: selectedDraftItem.Date,
        categoryData: [
          ...selectedDraftItem.categoryData,
          ...transformedProductCategory,
        ],
        productData: [
          ...selectedDraftItem.productData,
          ...transformedProductData,
        ],
        discount: selectedDraftItem.discount,
        totalPrice: totalPrice,
        isDraft: false,
      };
      const response = await handelPlaceOrder(draftData);
      if (isDraft === false) {
        generatePDFReceipt(response.newOrder);
      }
      DeleteOrders(selectedDraftItem._id);
      setSelectedItems([]);
      setSelectedSizes({});
      clearall();
      setIsDraftItemSelected(false)
      fetchItems()
      setActiveTab("newOrderBill");
      return;
    }

    try {
      const response = await handelPlaceOrder(data);
      if (isDraft === false) {
        generatePDFReceipt(response.newOrder);
      }
      setSelectedItems([]);
      setSelectedSizes({});
      clearall();
      setIsDraftItemSelected(false)
      fetchItems()
      setActiveTab("newOrderBill");
    } catch (error) {
      console.error("Failed to Placed Order", error);
    }
  };

  const calculateTotal = (items: any[], isDraft = false) => {
    const subtotal = calculateSubtotal(items, isDraft);
    const discountAmount = (discountValue / 100) * subtotal;
    return subtotal - discountAmount;
  };

  const handleQuantityChange = (
    itemId: string,
    amount: number,
    variants: any
  ) => {
    setSelectedItems((prevItems: any) =>
      prevItems.map((item: any) =>
        item._id === itemId && variants === item.selectedSizes[0]
          ? { ...item, quantity: Math.max(item.quantity + amount, 1) }
          : item
      )
    );
  };

  useEffect(() => {
    const total =
      calculateTotal(selectedItems) +
      calculateTotal(selectedDraftItem?.productData, true);
    setTotalPrice(total);
    getDiscount()
  }, [
    calculateTotal(selectedItems),
    calculateTotal(selectedDraftItem?.productData, true),
  ]);

  const UpdateOrder = async () => {
    const UpdateDraftData = {
      categoryData: [
        ...selectedDraftItem.categoryData,
        ...transformedProductCategory,
      ],
      productData: [
        ...selectedDraftItem.productData,
        ...transformedProductData,
      ],
      totalPrice,
    };

    try {
      await handelUpdateOrder(UpdateDraftData, selectedDraftItem._id);
      setSelectedItems([]);
      clearall();
      fetchItems();
      setActiveTab("newOrderBill");
      setIsDraftItemSelected(false);

      setToast({
        type: "success",
        message: "Draft Item Updated successfully!",
      });
      setSelectedSizes({});
    } catch (error) {
      console.error("Failed to Update Order", error);
    }
  };

  return (
    <>
      <div className="basis-full order-1 md:order-2 md:basis-[30%] border-l border-gray-100">
        <div className="shadow-lg">
          <div className="flex  justify-between items-center  rounded-xl shadow-md p-4">
            <button
              className={`font-semibold text-lg cursor-pointer ${
                activeTab === "newOrderBill"
                  ? "text-black border-b-2 border-[black]"
                  : "text-gray-400"
              }`}
              onClick={() => setActiveTab("newOrderBill")}
            >
              New Order Bill
            </button>
            {isDraftItemSelected ? (
              ""
            ) : (
              <button
                className={`font-semibold text-lg cursor-pointer ${
                  activeTab === "draft"
                    ? "text-black border-b-2 border-[black]"
                    : "text-gray-400"
                }`}
                onClick={handleDraftTab}
              >
                Draft
              </button>
            )}

            <span className="text-disabled text-lg">
              {formatDate(Date.now())}
            </span>
          </div>

          <div className="p-4 min-h-screen">
            {activeTab === "newOrderBill" ? (
              <div className="flex flex-col  gap-2 mb-4 h-[450px] max-h-[450px] overflow-auto border p-2">
                <div className="flex flex-col gap-4 ">
                  {Array.isArray(selectedDraftItem?.productData) &&
                    selectedDraftItem.productData.map((item: any) => (
                      <div
                        key={item._id}
                        className="bg-lightdisable flex justify-between rounded-md px-4 py-2 items-center relative"
                      >
                        <div className="absolute top-1 right-1 bg-white rounded-[50%] px-1 cursor-pointer">
                          <FontAwesomeIcon
                            icon={faClose}
                            onClick={() => {
                              setSelectedDraftItem((prevState: any) => ({
                                ...prevState,
                                productData: prevState.productData.filter(
                                  (product: any) => product._id !== item._id
                                ),
                              }));
                            }}
                          />
                        </div>
                        <div className="basis-[27%] rounded-[50%]">
                          <div className="w-[70px] h-[70px]">
                            <img
                              src={default2}
                              alt={default2}
                              className="rounded-[50%] w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col basis-[37%]">
                          <div className="capitalize">
                            {item.productName} ( {item.variants || "NA"} )
                          </div>
                          <div>Rs. {item.productPrice || "00.00"}</div>
                        </div>
                        <div className="basis-[37%] flex justify-center items-center">
                          <div className="bg-white rounded-[20px] px-4 py-2 flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedDraftItem((prevState: any) => ({
                                  ...prevState,
                                  productData: prevState.productData.map(
                                    (product: any) =>
                                      product._id === item._id
                                        ? {
                                            ...product,
                                            productQuantity: Math.max(
                                              product.productQuantity - 1,
                                              1
                                            ),
                                          }
                                        : product
                                  ),
                                }));
                              }}
                              className="bg-primary text-center w-6 h-6 text-white rounded-[50%]"
                            >
                              -
                            </button>
                            <span className="mx-2">{item.productQuantity}</span>
                            <button
                              onClick={() => {
                                setSelectedDraftItem((prevState: any) => ({
                                  ...prevState,
                                  productData: prevState.productData.map(
                                    (product: any) =>
                                      product._id === item._id
                                        ? {
                                            ...product,
                                            productQuantity:
                                              product.productQuantity + 1,
                                          }
                                        : product
                                  ),
                                }));
                              }}
                              className="bg-primary text-white w-6 h-6 text-center rounded-[50%]"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="flex flex-col gap-4">
                  {selectedItems?.map((item: any) => (
                    <div
                      key={`${item._id}-${item.selectedSizes[0]}`}
                      className="bg-lightdisable flex justify-between rounded-md px-4 py-2 items-center relative"
                    >
                      <div className="absolute top-1 right-1 bg-white rounded-[50%] px-1 cursor-pointer">
                        <FontAwesomeIcon
                          icon={faClose}
                          onClick={() => handleRemoveFromOrder(item._id)}
                        />
                      </div>
                      <div className="basis-[27%] rounded-[50%]">
                        <div className="w-[70px] h-[70px]">
                          <img
                            src={item.image || default2}
                            alt={item.name}
                            className="rounded-[50%] w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col basis-[37%]">
                        <div className="capitalize">
                          {item.name}
                          {item.selectedSizes?.length > 0 &&
                            item.selectedSizes[0] !== "" &&
                            ` (${item.selectedSizes.join(", ")})`}
                        </div>
                        <div>Rs. {item.price || "00.00"}</div>
                      </div>
                      <div className="basis-[37%] flex justify-center items-center">
                        <div className="bg-white rounded-[20px] px-4 py-2 flex gap-2">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item._id,
                                -1,
                                item.selectedSizes[0]
                              )
                            }
                            className="bg-primary text-center w-6 h-6 text-white rounded-[50%]"
                          >
                            -
                          </button>
                          <span className="mx-2">{item.quantity}</span>
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item._id,
                                +1,
                                item.selectedSizes[0]
                              )
                            }
                            className="bg-primary text-white w-6 h-6 text-center rounded-[50%]"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col    gap-2 mb-4 h-[450px] max-h-[450px] overflow-auto border p-2">
                {draftItem.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="bg-lightdisable relative  flex justify-between rounded-md px-4 py-2 items-center hover:scale-[0.9] cursor-pointer"
                    onClick={() => {
                      setActiveTab("newOrderBill");
                      setSelectedDraftItem(item);
                      setIsDraftItemSelected(true);
                    }}
                  >
                    <div className="flex flex-col gap-1">
                      <div className="absolute right-[0.5rem] top-[0.5rem]">
                        <FontAwesomeIcon
                          icon={faClose}
                          className=" bg-white rounded-[50%] p-1 cursor-pointer"
                          onClick={(e) => {
                            DeleteOrders(item._id);
                            handleDraftTab();
                            e.stopPropagation();
                          }}
                        />
                      </div>
                      <div className="text-sm mt-4 font-semibold text-gray-600">
                        Draft {index + 1}
                      </div>
                      <div className="text-xs text-gray-500">
                        Date: {formatDate(item.Date)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.productData?.length} items
                      </div>
                      <div className="text-sm font-semibold text-gray-800">
                        Total: {item.totalPrice}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-between">
              <div>
                <div className="flex gap-4 mb-2 ]">
                  <span className="font-bold"> Sub Total</span>
                  <span className="text-success">
                    Rs.{calculateSubtotal(selectedItems)}
                  </span>
                </div>
                <div className="flex gap-4 mb-2">
                  <span className="font-bold">Discount {discountValue}%</span>
                  <span className="text-success">
                    Rs.{(calculateDiscount(selectedItems) * 0.1)?.toFixed(2)}
                  </span>
                </div>
                <div className="flex gap-4 mb-2">
                  <span className="font-bold">Total</span>

                  <span className="text-success">
                    Rs.{calculateTotal(selectedItems)}
                  </span>
                </div>
              </div>
              <div>
                {isDraftItemSelected && (
                  <>
                    <div className="flex gap-4 mb-2">
                      <span className="font-bold"> Draft Sub Total</span>
                      <span className="text-success">
                        Rs.
                        {calculateSubtotal(
                          selectedDraftItem?.productData,
                          true
                        )?.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex gap-4 mb-2">
                      <span className="font-bold">Draft Discount {discountValue}%</span>
                      <span className="text-success">
                        Rs.
                        {(
                          calculateDiscount(
                            selectedDraftItem?.productData,
                            true
                          ) * 0.1
                        )?.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex gap-4 mb-2">
                      <span className="font-bold">Draft Total</span>

                      <span className="text-success">
                        Rs.
                        {calculateTotal(
                          selectedDraftItem?.productData,
                          true
                        )?.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex mb-4 gap-4 align-items-center">
                      <span className="font-bold">All Total</span>
                      <span className="text-success">
                        Rs.
                        {calculateTotal(selectedItems) +
                          calculateTotal(selectedDraftItem?.productData, true)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex w-full gap-2">
              <Button
                label={"Place Order"}
                className={` text-white rounded-md w-1/2 `}
                onClick={() => {
                  handlePlaceOrder(false);
                }}
              />
              {isDraftItemSelected ? (
                <Button
                  label={"Update"}
                  className={` text-white rounded-md w-1/2`}
                  onClick={() => {
                    UpdateOrder();
                  }}
                />
              ) : (
                <Button
                  label={"Draft"}
                  className={`text-white rounded-md w-1/2 ${
                    selectedItems.length === 0
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={() => {
                    handlePlaceOrder(true);
                    setToast({
                      type: "success",
                      message: "Item Add to Draft successfully!",
                    });
                  }}
                  disabled={selectedItems.length === 0}
                />
              )}
            </div>
          </div>
        </div>
        <div className=" absolute  top-[6rem]  right-0">
          {toast && (
            <ToastMessage
              type={toast.type}
              message={toast.message}
              onClose={() => setToast(null)}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
