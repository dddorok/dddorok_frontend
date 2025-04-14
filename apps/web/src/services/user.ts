import { apiInstance } from "./instance";

export const getTest = async () => {
  const response = await apiInstance.get("users/test");
  console.log("response: ", response);
  return response;
};
