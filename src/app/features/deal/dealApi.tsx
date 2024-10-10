import { makeApiCall } from "@/app/mixinApi/api";

export const getAllDeals = async () => {
  try {
    const response = await makeApiCall<any>({
      url: "api/all/deals",
      method: "GET",
    });
    return response;
  } catch (error) {
    throw new Error("Failed to fetch Deals");
  }
};

export const handelAddNewDeals = async (data: any, categoryId: any) => {  
  const params = categoryId ? { categoryId } : {};
  try {
    const response = await makeApiCall<any>({
      url: `api/create/deal`,
      method: "POST",
      data,
      params,
    });
    return response;
  } catch (error: any) {
    throw new Error(error.response.data.message || "Failed to add fetch Deals");
  }
};

export const handelDeleteDeals = async (id: any) => {
  try {
    const responce = await makeApiCall<any>({
      url: `api/delete/deal/${id}`,
      method: "DELETE",
    });
    return responce;
  } catch (error: any) {
    throw new Error(error.response.data.message || "Failed to delete Deals");
  }
};

export const handelUpdateDeals = async (data: any, id: any) => {
  try {
    const responce = await makeApiCall<any>({
      url: `api/update/deal/${id}`,
      method: "PUT",
      data,
    });
    return responce;
  } catch (error) {
    throw new Error("Failed to Update Deals");
  }
};
