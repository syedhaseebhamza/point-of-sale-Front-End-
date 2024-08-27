import { makeApiCall } from "@/app/mixinApi/api";

export const createNewUser = async (data: {
  username: string;
  password: string;
  role: string;
}) => {
  try {
    const response = await makeApiCall<any>({
      url: "user/create",
      method: "POST",
      data: data,
    });
    return response;
  } catch (error) {
    throw new Error("Faild To Create New User");
  }
};

export const getAllSubUser = async () => {
  try {
    const response = await makeApiCall<any>({
      url: "user/alluser",
      method: "GET",
    });
    return response.users;
  } catch (error) {
    throw new Error("Failed to fetch users");
  }
};

export const deleteSubUser = async (id: string) => {
  try {
    const response = await makeApiCall<any>({
      url: `user/delete/${id}`,
      method: "DELETE",
    });
    return response;
  } catch (error) {
    throw new Error("faild to delete subuser");
  }
};

export const editSubUser = async (id: string, data: any) => {
  try {
    const responce = await makeApiCall<any>({
      url: `user/update/${id}`,
      method: "PATCH",
      data: data,
    });
    return responce;
  } catch (error) {
    throw new Error("faild to update subuser ");
  }
};
