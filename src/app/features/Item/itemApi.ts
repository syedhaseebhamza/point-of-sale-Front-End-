import { makeApiCall } from "@/app/mixinApi/api";

export const getAllItem = async () => {
  try {
    const response = await makeApiCall<any>({
      url: "api/all/items",
      method: "GET",
    });
    return response.items;
  } catch (error) {
    throw new Error("Failed to fetch catagory");
  }
};
