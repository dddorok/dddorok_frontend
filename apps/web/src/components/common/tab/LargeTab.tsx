import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface TabItemProps {
  tabs: {
    id: string;
    content: React.ReactNode;
  }[];
  defaultTabId: string;

  // controlled
  tab?: string;
  onTabChange?: (tabId: string) => void;
}

export function LargeTab(props: TabItemProps) {
  const [activeTabId, setActiveTabId] = useState(props.defaultTabId);
  const handleTabClick = (tabId: string) => {
    setActiveTabId(tabId);
    props.onTabChange?.(tabId);
  };

  useEffect(() => {
    if (props.tab) {
      setActiveTabId(props.tab);
    }
  }, [props.tab]);

  return (
    <div className="flex items-center">
      {props.tabs.map((tab) => (
        <TabItem
          key={tab.id}
          content={tab.content}
          isActive={tab.id === activeTabId}
          onClick={() => handleTabClick(tab.id)}
        />
      ))}
    </div>
  );
}

function TabItem({
  content,
  isActive,
  onClick,
}: {
  content: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "cursor-pointer",
        "border-b border-neutral-N300 text-neutral-N400 text-small font-bold h-11",
        "flex items-center justify-center gap-1 flex-1",
        isActive && "border-primary-PR text-primary-PR"
      )}
    >
      {content}
    </div>
  );
}
