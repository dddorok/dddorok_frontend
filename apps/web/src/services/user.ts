import { apiInstance, privateInstance } from "./instance";

export const getTest = async () => {
  const response = await apiInstance.get("users/test");
  return response;
};

// /api/users/test/login
export const userTestLogin = async () => {
  const response = await privateInstance.get("users/test/login");
  console.log("response: ", response);
  return response;
};

interface MyInfoResponse {
  user: {
    id: string;
    username: string;
    subscribe: string;
    role: string;
  };
}

export const getMyInfo = async () => {
  const response = await privateInstance
    .get<{ data: MyInfoResponse }>("users/my-info")
    .json();

  return response.data;
};
