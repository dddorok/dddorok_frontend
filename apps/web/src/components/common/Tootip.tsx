import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";

export default function BasicTooltip({
  children,
  content,
}: {
  children: React.ReactNode;
  content: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{content}</TooltipContent>
    </Tooltip>
  );
}

export function ShortcutTooltip({
  children,
  content,
  shortcut,
}: {
  children: React.ReactNode;
  content: React.ReactNode;
  shortcut?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className="p-1 pl-[10px] flex items-center gap-2 text-xsmall">
        {content}
        {shortcut && (
          <span className="text-neutral-N0 bg-neutral-N400  px-1 rounded-[2px] text-xsmall font-medium">
            {shortcut}
          </span>
        )}
      </TooltipContent>
    </Tooltip>
  );
}
