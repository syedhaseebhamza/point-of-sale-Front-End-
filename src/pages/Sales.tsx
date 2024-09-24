import React, { useEffect, useState } from "react";
import { getAllCatagory } from "@/app/features/catagory/catagoryApi";
import {
  getItemByCategoryId,
  handelPlaceOrder,
  handelFetchAllDraftItem,
} from "@/app/features/sales/salesApi";
import Card from "@/components/common/cards";
import default2 from "../Images/default_rectangle.jpg";
import { getAllItem } from "@/app/features/Item/itemApi";
import Button from "@/components/common/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

function Sales() {
  const [catagory, setCatagory] = useState<any>([]);
  const [items, setItems] = useState<any>([]);
  const [selectedItems, setSelectedItems] = useState<any>([]);
  const [selectedSizes, setSelectedSizes] = useState<any>("");
  const [activeTab, setActiveTab] = useState("newOrderBill");
  const [draftItem, setDraftItem] = useState<any>([]);

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
    console.log(itemId, size);
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

  const calculateSubtotal = () => {
    return selectedItems.reduce((total: number, item: any) => {
      return total + (item.price || 0) * item.quantity;
    }, 0);
  };
  const discount = () => {
    return selectedItems.reduce((total: number, item: any) => {
      return total - (item.price || 0) * item.quantity;
    }, 0);
  };
  const handlePlaceOrder = async (isDraft: boolean) => {
    const data = {
      categoryData: selectedItems.map((item: any) => ({
        categoryId: item.categoryId,
      })),
      productData: selectedItems.map((item: any) => ({
        productId: item._id,
        productName: item.name,
        productQuantity: item.quantity,
        variants: item.selectedSizes[0],
      })),
      discount: 123213,
      totalPrice: 324324324,
      isDraft,
    };
    try {
      const response = await handelPlaceOrder(data);
      console.log("in page", response);
    } catch (error) {
      console.log("error", error);
    }
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = subtotal * 0.1;
    return subtotal - tax;
  };

  const handleQuantityChange = (
    itemId: string,
    amount: number,
    variants: any
  ) => {
    console.log(itemId, variants);
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
      console.log("response", response.orders);
      setDraftItem(response.orders);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      <div className="flex justify-between flex-wrap">
        <div className="flex flex-col md:gap-[3rem] order-2 md:order-1 basis-full md:basis-[70%]">
          <div className="grid grid-cols-7 gap-x-4 gap-y-4 w-full">
            {catagory.map((cat: any) => (
              <div onClick={() => handleItemClick(cat._id)}>
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
                  {selectedItems.map((item: any) => (
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
              ) : (
                <div className="flex flex-col  gap-2 mb-4 h-[450px] max-h-[450px] overflow-auto border p-2">
                  {draftItem.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="bg-lightdisable flex justify-between rounded-md px-4 py-2 items-center"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold text-gray-600">
                          Draft {index + 1}
                        </span>
                        <span className="text-xs text-gray-500">
                          Date: {formatDate(item.Date)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {draftItem.length} items
                        </span>
                        <span className="text-sm font-semibold text-gray-800">
                          Total: Rs.344
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between mb-2">
                <span className="font-bold">Sub Total</span>
                <span className="text-success">
                  Rs.{calculateSubtotal().toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-bold">Discount 10%</span>
                <span className="text-success">
                  Rs.{(discount() * 0.1).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-bold">Total</span>
                <span className="text-success">
                  Rs.{calculateTotal().toFixed(2)}
                </span>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sales;
