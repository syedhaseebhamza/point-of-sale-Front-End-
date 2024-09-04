import { makeApiCall } from "../../mixinApi/api";

export const getItemByCategoryId = (categoryId: any) => {
  const params = categoryId ? { categoryId } : {};
  try {
    const response = makeApiCall<any>({
      url: "api/all/items",
      method: "GET",
      params,
    });
    return response;
  } catch (error) {
    throw new Error("Failed to fetch Item");
  }
};
