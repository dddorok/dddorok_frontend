import ky from "ky";

export const apiInstance = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL,
  headers: {},
  hooks: {
    beforeRequest: [() => console.log("before 1")],
    afterResponse: [() => console.log("after 1")],
  },
});
