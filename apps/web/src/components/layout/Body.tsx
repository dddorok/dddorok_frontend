import { cn } from "@/lib/utils";

export default function Body({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex-1 container px-8", className)}>{children}</div>
  );
}
