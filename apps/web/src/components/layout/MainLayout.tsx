import Body from "./Body";
import Footer from "./Footer";
import Header from "./Header";

export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Body>{children}</Body>
      <Footer />
    </div>
  );
}
