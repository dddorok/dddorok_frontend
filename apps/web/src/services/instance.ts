import ky from "ky";

export const apiInstance = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL,
  headers: {},
  hooks: {
    beforeRequest: [() => console.log("before 1")],
    afterResponse: [
      async (request, options, response) => {
        // 응답이 있고 Content-Type이 JSON인 경우에만 파싱
        if (
          response.headers.get("Content-Type")?.includes("application/json")
        ) {
          const clone = response.clone();
          return clone.json();
        }
        return response;
      },
      () => console.log("after 1"),
    ],
  },
});
