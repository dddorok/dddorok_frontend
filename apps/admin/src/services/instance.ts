import ky, { HTTPError, Options } from "ky";
import { redirect } from "next/navigation";

import { updateSession } from "@/lib/auth";
import { verifySession } from "@/lib/dal";

export interface ErrorResponse {
  message: string;
  code: number;
  path: string;
  timestamp: string;
  error: string;
}

export class CustomError extends Error {
  message: string;
  code: number;
  path: string;
  timestamp: string;
  error: string;

  constructor(response: ErrorResponse) {
    super(response.message);
    this.message = response.message;
    this.code = response.code;
    this.path = response.path;
    this.timestamp = response.timestamp;
    this.error = response.error;
  }
}

const API_BASE_URL =
  (process.env.NEXT_PUBLIC_API_URL ?? "https://dev-admin-api.dddorok.com") +
  "/api";

export const apiInstance = ky.create({
  prefixUrl: API_BASE_URL,
  headers: {},
});

export const privateInstance = ky.create({
  prefixUrl: API_BASE_URL,
  headers: {},
  hooks: {
    beforeRequest: [
      async (request) => {
        console.log("beforeRequest window: ", typeof window);
        const session = await verifySession();
        if (session) {
          request.headers.set("Authorization", `Bearer ${session.accessToken}`);
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 401) {
          console.log("401");
          const data = (await response.json()) as ErrorResponse;

          if (data.code === 40101) {
            try {
              console.log("updateSession window: ", typeof window);
              await updateSession();
              const session = await verifySession();

              if (session) {
                const path = request.url.replace(API_BASE_URL, "");

                const newOptions: Options = {
                  ...options,
                  headers: {
                    ...options.headers,
                    Authorization: `Bearer ${session.accessToken}`,
                  },
                };

                return ky(path, {
                  ...newOptions,
                  method: request.method,
                });
              }
            } catch (refreshError) {
              console.error("토큰 갱신 실패:", refreshError);
              redirect("/oauth/login");
            }
          }
          // else {
          //   console.log("redirect to login");
          //   redirect("/oauth/login");
          // }
        }
        return response;
      },
    ],
    beforeError: [
      async (error: HTTPError) => {
        const { response } = error;

        if (response) {
          const data = (await response.json()) as ErrorResponse;
          error.message = data.message || "알 수 없는 에러가 발생했습니다.";
          throw new CustomError(data);
        }

        return error;
      },
    ],
  },
});
