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

export const handelPlaceOrder = async (data: any, categoryId: any , productId:any) => {
  const params = categoryId && productId ? { categoryId,productId } : {};
  
  try {
    const response = await makeApiCall<any>({
      url: `api/place/order`,
      method: "POST",
      data,
      params,
    });
    return response;
  } catch (error: any) {
    throw new Error(error.response.data.message || "Failed to place order");
  }
};
