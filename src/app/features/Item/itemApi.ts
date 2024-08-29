import { makeApiCall } from "@/app/mixinApi/api";

export const getAllItem = async () => {
  try {
    const response = await makeApiCall<any>({
      url: "api/all/items",
      method: "GET",
    });
    return response.items;
  } catch (error) {
    throw new Error("Failed to fetch Item");
  }
};

export const handelAddNewItem = async (data: any, categoryId: any) => {
  const params = categoryId ? { categoryId } : {};
  try {
    const response = await makeApiCall<any>({
      url: `api/create/item/`,
      method: "POST",
      data,
      params,
    });
    return response;
  } catch (error) {
    throw new Error("Failed to add fetch Item");
  }
};
