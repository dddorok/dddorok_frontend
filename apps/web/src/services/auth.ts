// /auth/login/{provider}
import { apiInstance } from "./instance";

export type LoginProvider = "naver" | "google" | "kakao";

interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

interface LoginRequest {
  provider: LoginProvider;
  code: string;
  state: string;
}

export const login = async (request: LoginRequest): Promise<LoginResponse> => {
  const response = await apiInstance
    .get<{ data: LoginResponse }>(`auth/login/${request.provider}`, {
      searchParams: {
        code: request.code,
        // state: request.state,
      },
    })
    .json();

  return response.data;
};
