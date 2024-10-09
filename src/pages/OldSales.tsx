import React, { useEffect, useState } from "react";
import { getAllCatagory } from "@/app/features/catagory/catagoryApi";
import {
  getItemByCategoryId,
  handelPlaceOrder,
  handelFetchAllDraftItem,
  handelDeleteOrder,
  handelUpdateOrder,
} from "@/app/features/sales/salesApi";
import Card from "@/components/common/cards";
import default2 from "../Images/default_rectangle.jpg";
import { getAllItem } from "@/app/features/Item/itemApi";
import Button from "@/components/common/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import ToastMessage from "@/components/common/toast";

function Sales() {
  const [catagory, setCatagory] = useState<any>([]);
  const [items, setItems] = useState<any[]>([]);
  const [updateItems, setUpdateItems] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<any>([]);
  const [selectedSizes, setSelectedSizes] = useState<any>("");
  const [activeTab, setActiveTab] = useState("newOrderBill");
  const [draftItem, setDraftItem] = useState<any>([]);
  const [selectedDraftItem, setSelectedDraftItem] = useState<any>({});
  const [isDraftItemSelected, setIsDraftItemSelected] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

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

  const handleItemClick = async (categoryId: string) => {
    try {
      const response = await getItemByCategoryId(categoryId);
      setItems(response.items);
    } catch (error) {
      console.error("Error fetching items for category:", error);
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

  const handleAddToOrder = (item: any) => {
    const selectedItemSizes = selectedSizes[item._id] || [];

    if (selectedItemSizes.length === 0) {
      alert("Please select a size.");
      return;
    }

    const newItems = selectedItemSizes.map((size: string) => {
      const selectedVariant = item.variants.find((v: any) => v.size === size);
      const price = selectedVariant ? selectedVariant.price : 0;
      return {
        categoryId: item.categoryId,
        _id: `${item._id}`,
        categoryName: item.categoryName,
        name: item.name,
        image: item.image,
        price,
        quantity: 1,
        selectedSizes: [size],
      };
    });

    setSelectedItems((prevItems: any) => {
      const filteredItems = prevItems.filter(
        (i: any) => !i._id.startsWith(item._id)
      );

      return [...filteredItems, ...newItems];
    });
  };

  const handleSizeClick = (itemId: string, size: string) => {
    setSelectedSizes((prevSizes: any) => {
      const updatedSizes = { ...prevSizes };
      if (updatedSizes[itemId]?.includes(size)) {
        updatedSizes[itemId] = updatedSizes[itemId].filter(
          (s: string) => s !== size
        );
        if (updatedSizes[itemId].length === 0) {
          delete updatedSizes[itemId];
        }
      } else {
        updatedSizes[itemId] = [...(updatedSizes[itemId] || []), size];
      }
      return updatedSizes;
    });
  };

  const handleRemoveFromOrder = (itemId: string, size?: string) => {
    setSelectedItems((prevItems: any) => {
      if (size) {
        return prevItems
          .map((item: any) => {
            if (item._id === itemId) {
              return {
                ...item,
                selectedSizes: item.selectedSizes.filter(
                  (s: string) => s !== size
                ),
              };
            }
            return item;
          })
          .filter((item: any) => item.selectedSizes.length > 0);
      } else {
      }
    });

    setSelectedSizes((prevSizes: any) => {
      const updatedSizes = { ...prevSizes };
      if (size) {
        updatedSizes[itemId] = updatedSizes[itemId]?.filter(
          (s: string) => s !== size
        );
        if (updatedSizes[itemId]?.length === 0) {
          delete updatedSizes[itemId];
        }
      } else {
        delete updatedSizes[itemId];
      }
      return updatedSizes;
    });
  };

  const DeleteOrders = (id: any) => {
    handelDeleteOrder(id)
      .then((res) => {
        const filterItem = items.filter((item: any) => item._id !== id);
        setItems(filterItem);
        setToast({
          type: "success",
          message: "Item deleted successfully!",
        });
      })
      .catch((error) => {
        setToast({
          type: "error",
          message: error.message,
        });
      });
  };

  const calculateSubtotal = (items: any[], isDraft = false) => {
    return items.reduce((total: number, item: any) => {
      const price = isDraft ? item.productPrice : item.price;
      const quantity = isDraft ? item.productQuantity : item.quantity;
      return total + (price || 0) * quantity;
    }, 0);
  };

  const calculateDiscount = (items: any[], isDraft = false) => {
    return items.reduce((total: number, item: any) => {
      const price = isDraft ? item.productPrice : item.price;
      const quantity = isDraft ? item.productQuantity : item.quantity;
      return total - (price || 0) * quantity;
    }, 0);
  };
  const handlePlaceOrder = async (isDraft: boolean) => {
    const totalPrice = selectedItems.reduce((total: number, item: any) => {
      return total + item.price * item.quantity;
    }, 0);

    const discount = totalPrice * 0.1;

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
      totalPrice: totalPrice - discount,
      isDraft,
    };
    try {
      await handelPlaceOrder(data);
      setSelectedItems([]);
      setSelectedSizes({});
    } catch (error) {
      console.log("error", error);
    }
  };

  const calculateTotal = (items: any[], isDraft = false) => {
    const subtotal = calculateSubtotal(items, isDraft);
    const tax = subtotal * 0.1;
    return subtotal - tax;
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

  const handleDraftTab = async () => {
    setActiveTab("draft");
    try {
      const response = await handelFetchAllDraftItem(true);

      setDraftItem(response.orders);
    } catch (error) {
      console.log("error", error);
    }
  };

  const clearall = () => {
    setSelectedDraftItem((prevState: any) => ({
      ...prevState,
      productData: [],
    }));
  };

  const transformedData = selectedItems.map((item: any) => ({
    isDeleted: false,
    productId: item._id,
    productName: item.name,
    productPrice: item.price,
    productQuantity: item.quantity,
    variants: item.selectedSizes[0],
  }));

  const UpdateOrder = async () => {
    setUpdateItems({
      ...selectedDraftItem,
      // totalPrice,
      productData: selectedDraftItem.productData.push(...transformedData),
    });
    try {
      await handelUpdateOrder(selectedDraftItem, selectedDraftItem._id);
      setActiveTab("draft");
      setSelectedItems([]);
      clearall();
    } catch (error) {
      console.error("Failed to Update Order", error);
    }
  };

  return (
    <>
      <div className="flex justify-between flex-wrap">
        <div className="flex flex-col md:gap-[3rem] order-2 md:order-1 basis-full md:basis-[70%]">
          <div className="grid grid-cols-7 gap-x-4 gap-y-4 w-full">
            {catagory.map((cat: any) => (
              <div key={cat._id} onClick={() => handleItemClick(cat._id)}>
                <Card
                  key={cat._id}
                  image={cat.image || "/default-image.jpg"}
                  name={cat.name}
                />
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {items.map((item: any) => (
              <div key={item._id} className="md:basis-[48%] lg:basis-[23%]">
                <div className="border rounded-xl shadow-lg p-4 lg:px-6 flex flex-col justify-center items-center gap-1">
                  <img
                    className="rounded-full object-cover bg-gray-100 h-[80px] w-[80px]"
                    src={item?.image || default2}
                    alt={item.name}
                  />
                  <div className="basis-full">
                    <span className="font-bold text-lg capitalize">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex gap-4 items-center basis-full">
                    <span className="text-2xl text-disabled">
                      {item.variants.map((variant: any, index: number) => (
                        <React.Fragment key={variant._id}>
                          <span
                            className={`capitalize cursor-pointer 
                            ${
                              selectedSizes[item._id]?.includes(variant.size)
                                ? "font-bold text-primary"
                                : ""
                            }
                            `}
                            onClick={() => {
                              handleSizeClick(item._id, variant.size);
                            }}
                          >
                            {variant.size.charAt(0)}
                          </span>
                          {index < item.variants.length - 1 && (
                            <span className="mx-1">|</span>
                          )}
                        </React.Fragment>
                      ))}
                    </span>

                    <Button
                      label={
                        selectedItems.some(
                          (selectedItem: any) => selectedItem._id === item._id
                        )
                          ? "Added"
                          : "Add"
                      }
                      className={`px-4 !py-1 ${
                        selectedItems.some(
                          (selectedItem: any) => selectedItem._id === item._id
                        )
                          ? "!bg-success"
                          : "!bg-disabled"
                      } text-white rounded-md`}
                      onClick={() => handleAddToOrder(item)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="basis-full order-1 md:order-2 md:basis-[30%] border-l border-gray-100">
          <div className="shadow-lg">
            <div className="flex  justify-between items-center  rounded-xl shadow-md p-4">
              <span
                className={`font-semibold text-lg cursor-pointer ${
                  activeTab === "newOrderBill"
                    ? "text-black border-b-2 border-[black]"
                    : "text-gray-400"
                }`}
                onClick={() => setActiveTab("newOrderBill")}
              >
                New Order Bill
              </span>
              <span
                className={`font-semibold text-lg cursor-pointer ${
                  activeTab === "draft"
                    ? "text-black border-b-2 border-[black]"
                    : "text-gray-400"
                }`}
                onClick={handleDraftTab}
              >
                Draft
              </span>
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
                        // {selectedDraftItem && selectedDraftItem.productData && selectedDraftItem?.productData?.map((item: any) => (
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
                              {item.productName} ( {item.variants} )
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
                              <span className="mx-2">
                                {item.productQuantity}
                              </span>
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
                            onClick={() =>
                              handleRemoveFromOrder(
                                item._id,
                                item.selectedSizes[0]
                              )
                            }
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
                            {item.name}{" "}
                            {item.selectedSizes.length > 0 &&
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
                <div className="flex flex-col   gap-2 mb-4 h-[450px] max-h-[450px] overflow-auto border p-2">
                  {draftItem.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="bg-lightdisable  relative flex justify-between rounded-md px-4 py-2 items-center hover:scale-[0.9] cursor-pointer"
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
                          {item.productData.length} items
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
                    <span className="font-bold">Discount 10%</span>
                    <span className="text-success">
                      Rs.{(calculateDiscount(selectedItems) * 0.1).toFixed(2)}
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
                          ).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex gap-4 mb-2">
                        <span className="font-bold">Draft Discount 10%</span>
                        <span className="text-success">
                          Rs.
                          {(
                            calculateDiscount(
                              selectedDraftItem?.productData,
                              true
                            ) * 0.1
                          ).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex gap-4 mb-2">
                        <span className="font-bold">Draft Total</span>

                        <span className="text-success">
                          Rs.
                          {calculateTotal(
                            selectedDraftItem?.productData,
                            true
                          ).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex mb-4 gap-4 align-items-center">
                        <span className="font-bold">All Total</span>
                        <span className="text-success">
                          Rs.
                          {calculateTotal(selectedItems) +
                            calculateTotal(
                              selectedDraftItem?.productData,
                              true
                            )}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="flex w-full gap-2">
                <Button
                  label={"Place Order"}
                  className={` text-white rounded-md w-1/2`}
                  onClick={() => handlePlaceOrder(false)}
                />
                <Button
                  label={"Draft"}
                  className={` text-white rounded-md w-1/2`}
                  onClick={() => handlePlaceOrder(true)}
                />
                <Button
                  label={"Update"}
                  className={` text-white rounded-md w-1/2`}
                  onClick={() => {
                    UpdateOrder();
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className=" absolute  top-[-6rem]  right-0">
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
}

export default Sales;
