import { makeApiCall } from "@/app/mixinApi/api";

export const getAllDiscount = async () => {
  try {
    const response = await makeApiCall<any>({
      url: "user/discount",
      method: "GET",
    });
    return response;
  } catch (error) {
    throw new Error("Failed to fetch Discount");
  }
};


export const handelUpdateDiscount = async (data: any) => {
  try {
    const responce = await makeApiCall<any>({
      url: "user/update/discount",
      method: "PUT",
      data,
    });
    return responce;
  } catch (error) {
    throw new Error("Failed to Update Deals");
  }
};
