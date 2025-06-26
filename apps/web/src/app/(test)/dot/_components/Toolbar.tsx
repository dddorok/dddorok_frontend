/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";

import {
  PasteIcon,
  CopyIcon,
  CutIcon,
  FlipHorizontalIcon,
  FlipVerticalIcon,
} from "../_icons/Copy";
import { SelectIcon } from "../_icons/Menu";
import { BrushTool } from "../constant";
import { usePixelArtEditorContext } from "../PixelArtEditorContext";
import { KNITTING_SYMBOLS, Shape } from "../Shape.constants";

import { cn } from "@/lib/utils";

export default function Toolbar() {
  const { brushTool, setBrushTool } = usePixelArtEditorContext();
  const isOpenSubMenu = brushTool === BrushTool.SELECT;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        "bg-neutral-N100 border-neutral-N300",
        "shadow-[0px_4px_16px_rgba(28,31,37,0.2)]",
        "rounded-lg",
        "w-fit min-h-[100px] px-8 py-[10px]",
        "fixed bottom-6 left-0 right-0 mx-auto"
      )}
    >
      {isOpenSubMenu && <BrushSubMenu />}

      <div
        className={cn(
          "flex gap-8 items-center justify-center",
          isOpenSubMenu && "py-2"
        )}
      >
        <SymbolButton isOpenSubMenu={isOpenSubMenu} />
        <BrushButton isOpenSubMenu={isOpenSubMenu} />
        <div className="flex flex-col items-center">
          <img
            src="/assets/icons/toolbar/pallet-icon.svg"
            alt="색상"
            width={32}
            height={32}
          />
          {!isOpenSubMenu && (
            <p className="text-neutral-N500 text-[16px] mt-1">색상</p>
          )}
        </div>
        <EraserButton isOpenSubMenu={isOpenSubMenu} />
      </div>
    </div>
  );
}

function SymbolButton({ isOpenSubMenu }: { isOpenSubMenu: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  const { brushTool, setBrushTool } = usePixelArtEditorContext();

  const isSelected = brushTool === BrushTool.DOT && isOpen;
  const { selectedShape, setSelectedShape } = usePixelArtEditorContext();

  const onShapeSelect = (shape: Shape) => {
    setSelectedShape(shape);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setBrushTool(BrushTool.DOT);
        }}
        className={cn("flex flex-col items-center")}
      >
        <div className={cn(menuStyle, isSelected && selectedMenuStyle)}>
          <canvas
            width={16}
            height={16}
            ref={(canvas) => {
              if (canvas) {
                const ctx = canvas.getContext("2d");
                if (ctx) {
                  ctx.clearRect(0, 0, 16, 16);
                  selectedShape.render(ctx, 0, 0, 16, selectedShape.color);
                }
              }
            }}
          />
        </div>
        {!isOpenSubMenu && (
          <p className={menuTextStyle(brushTool === BrushTool.DOT)}>기호</p>
        )}
      </button>

      {isSelected && (
        <div
          className={cn(
            "absolute bottom-[calc(100%+26px)] left-1/2 -translate-x-1/2 grid grid-cols-4 gap-2 py-3 px-4",
            "bg-neutral-N100 border-neutral-N300",
            "shadow-[0px_4px_16px_rgba(28,31,37,0.2)]",
            "rounded-lg w-fit min-w-[216px]"
          )}
        >
          {KNITTING_SYMBOLS.map((shape) => (
            <button
              key={shape.id}
              onClick={() => onShapeSelect(shape)}
              className={cn(
                "bg-neutral-N0 rounded-sm border border-neutral-N100 w-10 h-10",
                selectedShape.id === shape.id && "border-neutral-N500",
                "flex items-center justify-center"
              )}
              title={shape.name}
            >
              <canvas
                width={28}
                height={28}
                ref={(canvas) => {
                  if (canvas) {
                    const ctx = canvas.getContext("2d");
                    if (ctx) {
                      ctx.clearRect(0, 0, 28, 28);
                      shape.render(ctx, 0, 0, 28, shape.color);
                    }
                  }
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function BrushButton({ isOpenSubMenu }: { isOpenSubMenu: boolean }) {
  const { brushTool, setBrushTool } = usePixelArtEditorContext();

  return (
    <div>
      <button
        className={cn(
          menuStyle,
          brushTool === BrushTool.SELECT && selectedMenuStyle
        )}
        onClick={() => setBrushTool(BrushTool.SELECT)}
      >
        {isOpenSubMenu ? (
          <SelectIcon />
        ) : (
          <img
            src="/assets/icons/toolbar/select-icon.svg"
            alt="브러시"
            width={32}
            height={32}
          />
        )}

        {!isOpenSubMenu && (
          <p className={menuTextStyle(brushTool === BrushTool.SELECT)}>
            브러시
          </p>
        )}
      </button>
    </div>
  );
}

function EraserButton({ isOpenSubMenu }: { isOpenSubMenu: boolean }) {
  const { brushTool, setBrushTool } = usePixelArtEditorContext();

  const isSelected = brushTool === BrushTool.ERASER;

  return (
    <button
      className="flex flex-col items-center"
      onClick={() => setBrushTool(BrushTool.ERASER)}
    >
      <img
        src="/assets/icons/toolbar/eraser-icon.svg"
        alt="지우개"
        width={32}
        height={32}
      />
      {!isOpenSubMenu && (
        <p className={menuTextStyle(brushTool === BrushTool.ERASER)}>지우개</p>
      )}
    </button>
  );
}

function BrushSubMenu() {
  const list = [
    {
      Icon: PasteIcon,
      name: "복사",
    },
    {
      Icon: CopyIcon,
      name: "붙여넣기",
    },
    {
      Icon: CutIcon,
      name: "잘라내기",
    },
    {
      Icon: FlipVerticalIcon,
      name: "좌우반전",
    },
    {
      Icon: FlipHorizontalIcon,
      name: "상하반전",
    },
  ];

  return (
    <div
      className={cn(" flex flex-nowrap gap-3", "border-b border-neutral-N600")}
    >
      {list.map((item) => (
        <div key={item.name} className="flex flex-col items-center py-1 px-3">
          <item.Icon />
          <p className="text-neutral-N500 text-[16px] mt-1 whitespace-nowrap">
            {item.name}
          </p>
        </div>
      ))}
    </div>
  );
}

const menuStyle =
  "rounded-sm w-8 h-8 flex flex-col items-center justify-center";
const selectedMenuStyle = "bg-[rgba(29,217,231,0.2)] border border-[#1DD9E7] ";

const menuTextStyle = (isSelected: boolean) =>
  cn(
    "text-neutral-N500 text-[16px] mt-1 whitespace-nowrap",
    isSelected && "text-neutral-N800"
  );
