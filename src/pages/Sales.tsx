import { getAllCatagory } from "@/app/features/catagory/catagoryApi";
import Card from "@/components/common/cards";
import Drawer from "@/components/common/drawer";
import React, { useEffect, useState } from "react";

function Sales() {
  const [catagory, setCatagory] = useState<any>([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const handleOpenDrawer = () => setDrawerOpen(true);
  const handleCloseDrawer = () => setDrawerOpen(false);

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

  console.log("catagory", catagory);

  return (
    <div>
      <div className="grid grid-cols-6 gap-x-4 gap-y-4">
        {catagory.map((cat: any) => (
          <Card
            key={cat._id}
            image={cat.image || "/default-image.jpg"}
            name={cat.name}
            description={cat.description}
          />
        ))}
      </div>
      <button onClick={handleOpenDrawer} className="btn btn-primary">
        Open Drawer
      </button>
      <Drawer isOpen={isDrawerOpen} onClose={handleCloseDrawer}>
        <h5
          id="drawer-right-label"
          className="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400"
        >
          Right drawer
        </h5>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          Supercharge your hiring by taking advantage of our limited-time sale.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <a
            href="#"
            className="px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none hover:bg-gray-100 hover:text-blue-700"
          >
            Learn more
          </a>
          <a
            href="#"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800"
          >
            Get access
          </a>
        </div>
      </Drawer>
    </div>
  );
}

export default Sales;
