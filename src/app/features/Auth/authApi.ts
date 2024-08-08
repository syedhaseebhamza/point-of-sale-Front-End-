import { makeApiCall } from "@/app/mixinApi/api";

export const loginUser = async (credentials: {
  username: string;
  password: string;
}) => {
  try {
    const response = await makeApiCall<any>({
      url: "user/login",
      method: "POST",
      data: credentials,
    });
    console.log("loginUser Response:", response);
    return response;
  } catch (error) {
    throw new Error("Login Faild");
  }
};
