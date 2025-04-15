// /auth/login/{provider}
import { apiInstance } from "./instance";

export type LoginProvider = "naver" | "google" | "kakao";

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export const login = async (provider: LoginProvider) => {
  console.log("provider: ", provider);
  const response = await apiInstance.get(`auth/login/${provider}`);

  return response;
};

///auth/login/{provider}/callback

export const loginCallback = async (provider: LoginProvider) => {
  const response = await apiInstance.get(`auth/login/${provider}/callback`);
  console.log("response: ", response);
  return response;
};
