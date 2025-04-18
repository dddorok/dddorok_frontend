import ky from "ky";

import { updateSession } from "@/lib/auth";
import { verifySession } from "@/lib/dal";

export const apiInstance = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL + "/api",
  headers: {},
  hooks: {},
});

export const privateInstance = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL + "/api",
  headers: {},
  hooks: {
    beforeRequest: [
      async (request) => {
        const session = await verifySession();
        if (session) {
          request.headers.set("Authorization", `Bearer ${session.accessToken}`);
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 401) {
          await updateSession();
          const session = await verifySession();
          if (session) {
            request.headers.set(
              "Authorization",
              `Bearer ${session.accessToken}`
            );
            return ky(request, options);
          }
        }
      },
    ],
  },
});
