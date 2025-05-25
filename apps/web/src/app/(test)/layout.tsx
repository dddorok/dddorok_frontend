export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (process.env.NODE_ENV === "development") {
    return <div>{children}</div>;
  }
  return <div>Not Found</div>;
}
