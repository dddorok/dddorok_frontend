import { Meta, StoryObj } from "@storybook/nextjs-vite";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "./dialog";

const meta: Meta = {
  title: "Components/Dialog",
  component: Dialog,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const 기본: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <button className="px-4 py-2 rounded bg-neutral-N500 text-white">
          다이얼로그 열기
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>기본 다이얼로그</DialogTitle>
          <DialogDescription>설명 텍스트가 들어갑니다.</DialogDescription>
        </DialogHeader>
        <div>여기에 원하는 내용을 넣을 수 있습니다.</div>
        <DialogFooter>
          <DialogClose asChild>
            <button className="px-4 py-2 rounded bg-neutral-N500 text-white">
              닫기
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const onPrevious_버튼: Story = {
  render: () => {
    const handlePrevious = () => {
      alert("이전 버튼 클릭됨");
    };
    return (
      <Dialog>
        <DialogTrigger asChild>
          <button className="px-4 py-2 rounded bg-neutral-N500 text-white">
            이전 버튼 다이얼로그
          </button>
        </DialogTrigger>
        <DialogContent onPrevious={handlePrevious}>
          <DialogHeader>
            <DialogTitle>이전 버튼 다이얼로그</DialogTitle>
          </DialogHeader>
          <div>
            onPrevious prop이 전달되면 왼쪽 상단에 이전 버튼이 노출됩니다.
          </div>
        </DialogContent>
      </Dialog>
    );
  },
};

export const 커스텀_컨텐츠: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <button className="px-4 py-2 rounded bg-neutral-N500 text-white">
          커스텀 컨텐츠
        </button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col items-center space-y-4">
          <span className="text-lg font-bold">커스텀 영역</span>
          <input
            className="border rounded px-2 py-1"
            placeholder="입력해보세요"
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <button className="px-4 py-2 rounded bg-neutral-N500 text-white">
              확인
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
