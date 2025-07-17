import Body from "./Body";
import Footer from "./Footer";
import Header from "./Header";

import { cn } from "@/lib/utils";

export default function CommonLayout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col min-h-screen", className)}>
      <Header />
      <Body>{children}</Body>
      <Footer />
    </div>
  );
}
