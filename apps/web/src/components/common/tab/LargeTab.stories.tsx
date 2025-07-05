// @ts-nocheck
import { CheckIcon } from "lucide-react";

import { LargeTab } from "./LargeTab";

const meta = {
  title: "Common/Tab/LargeTab",
  component: LargeTab,
  tags: ["autodocs"],
};

export default meta;

export const Default = {
  args: {
    tabs: [
      {
        id: "tab1",
        content: (
          <>
            <CheckIcon className="w-[14px] h-[14px]" />
            <span>탭 1</span>
          </>
        ),
      },
      {
        id: "tab2",
        content: (
          <>
            <CheckIcon className="w-[14px] h-[14px]" />
            <span>탭 2</span>
          </>
        ),
      },
      {
        id: "tab3",
        content: (
          <>
            <CheckIcon className="w-[14px] h-[14px]" />
            <span>탭 3</span>
          </>
        ),
      },
    ],
    defaultTabId: "tab1",
  },
};
