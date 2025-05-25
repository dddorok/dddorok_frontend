import React from "react";

import { Button } from "@/components/ui/button";

// 사용 예시 컴포넌트
export default function ButtonExamples() {
  return (
    <div className="p-8 space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Button Variants</h2>

        {/* Color Variants */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Colors</h3>
          <div className="flex gap-4 flex-wrap">
            <Button color="default">Default</Button>
            <Button color="fill">Fill</Button>
            <Button color="trans">Trans</Button>
          </div>
        </div>

        {/* With Icons */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">With Icons</h3>
          <div className="flex gap-4 flex-wrap">
            <Button color="default">
              <PlayIcon />
              With Left Icon
            </Button>
            <Button color="fill">
              <ArrowIcon />
              With Right Icon
            </Button>
            <Button color="trans">
              <PlayIcon />
              Both Icons
              <ArrowIcon />
            </Button>
          </div>
        </div>

        {/* States */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">States</h3>
          <div className="flex gap-4 flex-wrap">
            <Button color="fill">Normal</Button>
            <Button color="fill" disabled>
              Disabled
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 아이콘 컴포넌트들 (예시)
const PlayIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-full h-full">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
      clipRule="evenodd"
    />
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-full h-full">
    <path
      fillRule="evenodd"
      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
      clipRule="evenodd"
    />
  </svg>
);
