import React, { useEffect, useState } from "react";
import { getAllCatagory } from "@/app/features/catagory/catagoryApi";
import { getItemByCategoryId } from "@/app/features/sales/salesApi";
import Card from "@/components/common/cards";
import defaultimage from "../Images/default_rectangle.jpg";

function Sales() {
  const [catagory, setCatagory] = useState<any>([]);
  const [selectedItemValueByCategoryId, setSelectedItemValueByCategoryId] =
    useState<any>([]);

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

  const handleItemClick = async (categoryId: string) => {
    try {
      const response = await getItemByCategoryId(categoryId);
      console.log("Fetched Items:", response.items);
      setSelectedItemValueByCategoryId(response.items);
    } catch (error) {
      console.error("Error fetching items for category:", error);
    }
  };

  return (
    <>
      <div className="flex w-full justify-between">
        <div className="flex flex-col gap-[4rem]   justify-between w-[70%]">
          <div className="grid grid-cols-7 gap-x-4 gap-y-4  w-full">
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
          <div className="flex flex-row gap-4   w-full">
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
          </div>
        </div>

        <div className="w-[30%] bg-primary">sad</div>
      </div>
    </>
  );
}

export default Sales;
