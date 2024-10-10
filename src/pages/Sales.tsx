import React, { useEffect, useState } from "react";
import { getAllCatagory } from "@/app/features/catagory/catagoryApi";
import { getItemByCategoryId } from "@/app/features/sales/salesApi";
import Card from "@/components/common/cards";
import default2 from "../Images/default_rectangle.jpg";
import { getAllItem } from "@/app/features/Item/itemApi";
import { getAllDeals } from "@/app/features/deal/dealApi";
import Button from "@/components/common/button";
import Cart from "@/components/Cart";
import Loader from "@/components/common/Loader/Loader";

function Sales() {
  const [catagory, setCatagory] = useState<any>([]);
  const [items, setItems] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<any>([]);
  const [selectedSizes, setSelectedSizes] = useState<any>("");
  const [selectedDraftItem, setSelectedDraftItem] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCatagory = async () => {
      try {
        const response = await getAllCatagory();
        setIsLoading(true);
        setCatagory(response);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch categories", error);
        setIsLoading(false);
      }
    };

    fetchCatagory();
  }, []);
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await getAllItem();
        setIsLoading(true);
        setItems(response);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch Items", error);
        setIsLoading(false);
      }
    };
    fetchItems();
  }, []);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setIsLoading(true);
        const response = await getAllDeals();
        setDeals(response.deals);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch categories", error);
        setIsLoading(false);
      }
    };
    fetchDeals();
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

  const handleAddDealToOrder = (deal: any) => {
    const newDeal = {
      _id: `${deal._id}`,
      name: deal.name,
      image: deal.image,
      price: deal.price,
      quantity: 1,
      categoryId: deal.categoryId,
    };

    setSelectedItems((prevItems: any) => {
      const filteredItems = prevItems.filter((i: any) => i._id !== deal._id);
      return [...filteredItems, newDeal];
    });
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

            {deals.map((data: any) => (
              <div key={data._id} className="md:basis-[48%] lg:basis-[23%]">
                <div className="border rounded-xl shadow-lg p-4 lg:px-6 flex flex-col justify-center items-center gap-1">
                  <img
                    className="rounded-full object-cover bg-gray-100 h-[80px] w-[80px]"
                    src={data?.image || default2}
                    alt={data.name}
                  />
                  <div className="basis-full">
                    <span className="font-bold text-lg capitalize">
                      {data.name}
                    </span>
                  </div>
                  <div className="flex gap-4 items-center basis-full">
                    <Button
                      label={
                        selectedItems.some(
                          (selectedItem: any) => selectedItem._id === data._id
                        )
                          ? "Added"
                          : "Add"
                      }
                      className={`px-4 !py-1 ${
                        selectedItems.some(
                          (selectedItem: any) => selectedItem._id === data._id
                        )
                          ? "!bg-success"
                          : "!bg-disabled"
                      } text-white rounded-md`}
                      onClick={() => {
                        handleAddDealToOrder(data);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Cart
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          setItems={setItems}
          setSelectedSizes={setSelectedSizes}
          setSelectedDraftItem={setSelectedDraftItem}
          selectedDraftItem={selectedDraftItem}
          items={items}
        />
      </div>
      {isLoading && <Loader />}
    </>
  );
}

export default Sales;
