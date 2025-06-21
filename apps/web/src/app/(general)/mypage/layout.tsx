import CommonLayout from "@/components/layout/MainLayout";

export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CommonLayout>{children}</CommonLayout>;
}
