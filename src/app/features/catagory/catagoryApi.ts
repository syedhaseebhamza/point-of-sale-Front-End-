import { makeApiCall } from "@/app/mixinApi/api";

export const getAllCatagory = async () => {
  try {
    const response = await makeApiCall<any>({
      url: "api/all/category",
      method: "GET",
    });
    return response.categories;
  } catch (error) {
    throw new Error("Failed to fetch catagory");
  }
};

export const handelAddCatagory = async (data: any) => {
  try {
    const responce = await makeApiCall<any>({
      url: "api/create/category",
      method: "POST",
      data,
    });
    return responce;
  } catch (error) {
    throw new Error("Failed to add catagory");
  }
};

export const handelDeleteCategory = async (id: any) => {
  try {
    const responce = await makeApiCall<any>({
      url: `api/delete/category/${id}`,
      method: "DELETE",
    });
    return responce;
  } catch (error) {
    throw new Error("Failed to delete catagory");
  }
};
