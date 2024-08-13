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
    console.log("Create New User Response:", response);
    return response;
  } catch (error) {
    throw new Error("Faild To Create New User");
  }
};

export const getAllSubUser = async () => {
  try {
    const response = await makeApiCall<any>({
      url: "user/subuser",
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
