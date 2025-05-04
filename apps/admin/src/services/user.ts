import { apiInstance, privateInstance } from "./instance";

export const getTest = async () => {
  const response = await apiInstance.get("users/test");
  console.log("response: ", response);
  return response;
};

export const userTestLogin = async () => {
  const response = await privateInstance.get("users/test/login");
  console.log("response: ", response);
  return response;
};
