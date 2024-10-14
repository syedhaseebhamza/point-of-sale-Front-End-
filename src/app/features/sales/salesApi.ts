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

export const getDealByCategoryId = (categoryId: any) => {
  const params = categoryId ? { categoryId } : {};
  try {
    const response = makeApiCall<any>({
      url: "api/all/deals",
      method: "GET",
      params,
    });
    return response;
  } catch (error) {
    throw new Error("Failed to fetch Item");
  }
};

export const handelPlaceOrder = async (data: any) => {
  try {
    const response = await makeApiCall<any>({
      url: `api/place/order`,
      method: "POST",
      data,
    });
    return response;
  } catch (error: any) {
    throw new Error(error.response.data.message || "Failed to place order");
  }
};

export const fetchPlaceOrder = async (isDraft?: boolean, date?: string, page: number = 1, limit: number = 10) => {
  try {
    const queryParams = new URLSearchParams();

    if (isDraft !== undefined) {
      queryParams.append("isDraft", isDraft.toString());
    }
    
    if (date) {
      queryParams.append("date", date);
    }

    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());

    const response = await makeApiCall<any>({
      url: `api/all/order?${queryParams.toString()}`,
      method: "GET",
    });

    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch orders");
  }
};


export const handelFetchAllDraftItem = async (isDraft: boolean) => {
  const params = isDraft ? { isDraft } : {};
  try {
    const response = await makeApiCall<any>({
      url: `api/all/draft/order`,
      method: "GET",
      params,
    });
    return response;
  } catch (error: any) {
    throw new Error(error.response.data.message || "Failed to Fetch order");
  }
};

export const handelDeleteOrder = async (id: any) => {
  try {
    const responce = await makeApiCall<any>({
      url: `api/delete/order/${id}`,
      method: "DELETE",
    });
    return responce;
  } catch (error: any) {
    throw new Error(error.response.data.message || "Failed to delete order");
  }
};

export const handelUpdateOrder = async (data: any, id: any) => {
  try {
    const responce = await makeApiCall<any>({
      url: `api/update/order/${id}`,
      method: "PUT",
      data,
    });
    return responce;
  } catch (error) {
    throw new Error("Failed to Update order");
  }
};