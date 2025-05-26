export const ROUTE = {
  HOME: "/",
  TEMPLATE: "/template",
  LOGIN: "/auth/login",
  PROJECT: {
    NEW: (templateId: string, name: string) =>
      `/project/new?templateId=${templateId}&name=${name}`,
  },
};
