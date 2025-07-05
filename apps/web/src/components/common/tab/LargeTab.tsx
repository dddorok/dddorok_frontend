import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface TabItemProps<T extends string> {
  tabs: {
    id: T;
    label: React.ReactNode;
    content?: React.ReactNode;
  }[];
  defaultTabId: string;
  className?: string;

  // controlled
  tab?: T;
  onTabChange?: (tabId: T) => void;
}

export function LargeTab<T extends string = string>(props: TabItemProps<T>) {
  const [activeTabId, setActiveTabId] = useState(props.defaultTabId);

  const currentTab = props.tabs.find((tab) => tab.id === activeTabId);

  const handleTabClick = (tabId: T) => {
    setActiveTabId(tabId);
    props.onTabChange?.(tabId);
  };

  useEffect(() => {
    if (props.tab) {
      setActiveTabId(props.tab);
    }
  }, [props.tab]);

  return (
    <div className={cn("flex flex-col gap-3", props.className)}>
      <div className={cn("flex items-center", "tab-list")}>
        {props.tabs.map((tab) => (
          <TabItem
            key={tab.id}
            label={tab.label}
            isActive={tab.id === activeTabId}
            onClick={() => handleTabClick(tab.id)}
          />
        ))}
      </div>
      {currentTab?.content && (
        <div className={cn("tab-content")}>{currentTab?.content}</div>
      )}
    </div>
  );
}

function TabItem({
  label,
  isActive,
  onClick,
}: {
  label: React.ReactNode;
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
      {label}
    </div>
  );
}
