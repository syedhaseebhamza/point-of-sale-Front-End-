import React, { useEffect, useState } from "react";
import { getAllCatagory } from "@/app/features/catagory/catagoryApi";
import { getItemByCategoryId } from "@/app/features/sales/salesApi";
import Card from "@/components/common/cards";
import default2 from "/burgerphoto.jpg";
import { getAllItem } from "@/app/features/Item/itemApi";
import Button from "@/components/common/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { log } from "console";

function Sales() {
  const [catagory, setCatagory] = useState<any>([]);
  const [items, setItems] = useState<any>([]);
  const [selectedItems, setSelectedItems] = useState<any>([]);
  const [selectedSizes, setSelectedSizes] = useState<{
    [key: string]: string[];
  }>({});

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

  const handleAddToOrder = (item: any) => {
    const selectedItemSizes = selectedSizes[item._id] || [];

    if (selectedItemSizes.length === 0) {
      Swal.fire({
        title: "Please select at least one size.",
        icon: "warning",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }

    // Calculate total price for all selected sizes
    const totalItemPrice = item.variants.reduce(
      (total: number, variant: any) => {
        if (selectedItemSizes.includes(variant.size)) {
          return total + variant.price;
        }
        return total;
      },
      0
    );

    if (
      !selectedItems.some((selectedItem: any) => selectedItem._id === item._id)
    ) {
      setSelectedItems((prev: any) => [
        ...prev,
        {
          ...item,
          selectedSizes: selectedItemSizes,
          quantity: 1,
          price: totalItemPrice,
        },
      ]);
      setSelectedSizes((prevSizes) => {
        const updatedSizes = { ...prevSizes };
        return updatedSizes;
      });
    }
  };
  const handleIncreaseQuantity = (itemId: string) => {
    setSelectedItems((prevItems: any) =>
      prevItems.map((item: any) =>
        item._id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };
  
  const handleDecreaseQuantity = (itemId: string) => {
    setSelectedItems((prevItems: any) =>
      prevItems.map((item: any) =>
        item._id === itemId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };
  const handleSizeClick = (itemId: string, size: string) => {
    const item = items.find((i: any) => i._id === itemId);
    if (item) {
      const selectedVariant = item.variants.find((v: any) => v.size === size);
      const price = selectedVariant ? selectedVariant.price : 0;

      setSelectedSizes((prevSizes) => {
        const currentSizes = prevSizes[itemId] || [];
        const updatedSizes = currentSizes.includes(size)
          ? currentSizes.filter((s) => s !== size)
          : [...currentSizes, size];
        return { ...prevSizes, [itemId]: updatedSizes };
      });

      setSelectedItems((prevItems: any) =>
        prevItems.map((i: any) =>
          i._id === itemId ? { ...i, selectedSize: size, price } : i
        )
      );
    }
  };
  const handleRemoveFromOrder = (itemId: string, size?: string) => {
    setSelectedItems((prevItems: any) => {
      if (size) {
        // Remove only the specific size of the item
        return prevItems.filter((item: any) => item._id !== itemId || !item.selectedSizes.includes(size));
      } else {
        // Remove all sizes of the item
        return prevItems.filter((item: any) => !item._id.startsWith(itemId));
      }
    });
    
    setSelectedSizes((prevSizes) => {
      const updatedSizes = { ...prevSizes };
      if (size) {
        // Remove the specific size from the selectedSizes
        updatedSizes[itemId] = updatedSizes[itemId]?.filter((s: string) => s !== size);
        if (updatedSizes[itemId]?.length === 0) {
          delete updatedSizes[itemId];
        }
      } else {
        // Remove all sizes for the item
        delete updatedSizes[itemId];
      }
      return updatedSizes;
    });
  };
  const calculateSubtotal = () => {
    return selectedItems.reduce((total: number, item: any) => {
      const itemPrice = item.variants.reduce(
        (totalPrice: number, variant: any) => {
          if (item.selectedSizes.includes(variant.size)) {
            return totalPrice + variant.price;
          }
          return totalPrice;
        },
        0
      );

      return total + (itemPrice || 0) * item.quantity;
    }, 0);
  };
  const handlePlaceOrder = () => {
    // const simplifiedItems = selectedItems.map(item => ({
    //   categoryName: item.categoryName,
    //   name: item.name,
    //   image: item.image,
    //   price: item.price,
    //   quantity: item.quantity,
    //   selectedSizes: item.selectedSizes,
    // }));

    const data = {
      categoryData: selectedItems.map((item: any) => ({
        categoryId: item.categoryId,
      })),
      productData: selectedItems.map((item: any) => ({
        id: item._id,
        name: item.name,
        totalPrice: item.price,
        quantity: item.quantity,
        variants: item.selectedSizes,
      })),
    };
    console.log(data);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = subtotal * 0.1;
    return subtotal + tax;
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

          {/* <div className="flex flex-row gap-4 w-full">
            {selectedItemValueByCategoryId.map((item: any) => (
              <div key={item._id}>
                <div className="border min-w-36 max-w-36">
                  <img
                    className="w-full rounded-tl-[6px] rounded-tr-[6px]  min-h-20 max-h-20 bg-contain"
                    src={item?.image || defaultimage}
                    alt={item.name}
                  />
                  <div className="px-4 py-1">
                    <span className="font-bold">{item.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div> */}

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
                            className={`capitalize cursor-pointer ${
                              selectedSizes[item._id]?.includes(variant.size)
                                ? "font-bold text-primary"
                                : ""
                            }`}
                            onClick={() =>
                              !selectedItems.some(
                                (selectedItem: any) =>
                                  selectedItem._id === item._id
                              ) && handleSizeClick(item._id, variant.size)
                            }
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
                      disabled={
                        selectedItems.some(
                          (selectedItem: any) => selectedItem._id === item._id
                        ) || selectedSizes[item._id]?.length === 0
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="basis-full order-1 md:order-2 md:basis-[30%] border-l border-gray-100">
          <div className="shadow-lg">
            <div className="flex  justify-between items-center rounded-xl shadow-md p-4">
              <span className="font-semibold text-lg">New Order Bill</span>
              <span className="text-disabled text-lg">
                Wednesday 28 August 2024
              </span>
            </div>
            <div className="p-4 min-h-screen">
              <div className="flex flex-col  gap-2 mb-4 h-[450px] max-h-[450px] overflow-auto border p-2">
                {selectedItems.map((item: any) => (
                  <div
                    key={`${item._id}-${item.selectedSizes[0]}`}
                    className="bg-lightdisable flex justify-between rounded-md px-4 py-2 items-center relative"
                  >
                    <div className="absolute top-1 right-1 bg-white rounded-[50%] px-1 cursor-pointer">
                      <FontAwesomeIcon
                        icon={faClose}
                        onClick={() => handleRemoveFromOrder(item._id, item.selectedSizes[0])}
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
                          ` (${item.selectedSizes
                            .map((size: string) => size.charAt(0))
                            .join(", ")})`}
                      </div>
                      <div>
                        {/* Rs. {item.price || "00.00"} */}
                        Rs.{" "}
                        {item.selectedSizes.length > 0
                          ? item.selectedSizes.reduce(
                              (total: number, size: string) => {
                                const selectedVariant = item.variants.find(
                                  (variant: any) => variant.size === size
                                );
                                return (
                                  total +
                                  (selectedVariant ? selectedVariant.price : 0)
                                );
                              },
                              0
                            )
                          : "00.00"}
                      </div>
                    </div>
                    <div className="basis-[37%] flex justify-center items-center">
                      <div className="bg-white rounded-[20px] px-4 py-2 flex gap-2">
                        <button
                          className="bg-primary text-center w-6 h-6 text-white rounded-[50%]"
                          onClick={() => handleDecreaseQuantity(item._id)}
                        >
                          -
                        </button>
                        <span className="mx-2">{item.quantity}</span>
                        <button
                          className="bg-primary text-white w-6 h-6 text-center rounded-[50%]"
                          onClick={() => handleIncreaseQuantity(item._id)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mb-2">
                <span className="font-bold">Sub Total</span>
                <span className="text-success">
                  Rs.{calculateSubtotal().toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-bold">Tax 10% (VAT Included)</span>
                <span className="text-success">
                  Rs.{(calculateSubtotal() * 0.1).toFixed(2)}
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
                  onClick={handlePlaceOrder}
                />
                <Button
                  label={"Draft"}
                  className={` text-white rounded-md w-1/2`}
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
