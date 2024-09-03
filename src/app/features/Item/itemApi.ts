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
  } catch (error: any) {
    throw new Error(error.response.data.message || "Failed to add fetch Item");
  }
};

export const handelDeleteItem = async (id: any) => {
  try {
    const responce = await makeApiCall<any>({
      url: `api/delete/item/${id}`,
      method: "DELETE",
    });
    return responce;
  } catch (error: any) {
    throw new Error(error.response.data.message || "Failed to delete item");
  }
};

export const handelUpdateItem = async (data: any, id: any) => {
  try {
    const responce = await makeApiCall<any>({
      url: `api/update/item/${id}`,
      method: "PUT",
      data,
    });
    return responce;
  } catch (error) {
    throw new Error("Failed to Update item");
  }
};
