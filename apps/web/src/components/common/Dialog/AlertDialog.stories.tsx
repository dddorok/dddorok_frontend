import { useState } from "react";

import { AlertDialog } from "./AlertDialog";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof AlertDialog> = {
  title: "Components/Dialog/AlertDialog",
  component: AlertDialog,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof AlertDialog>;

export const Default: Story = {
  args: {
    title: "정말 삭제하시겠습니까?",
    description: "이 작업은 되돌릴 수 없습니다.",
    actionText: "삭제",
    open: true,
  },
};
