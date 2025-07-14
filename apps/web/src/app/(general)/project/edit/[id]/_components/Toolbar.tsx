import { useState } from "react";

import {
  PasteIcon,
  CopyIcon,
  CutIcon,
  FlipHorizontalIcon,
  FlipVerticalIcon,
} from "../_icons/Copy";
import {
  EraserIcon,
  PaletteIcon,
  SelectIcon,
  ColorPaletteIcon,
} from "../_icons/Menu";
import {
  BrushTool,
  BrushToolType,
  SELECTION_BACKGROUND_COLORS,
  SelectionBackgroundColorType,
} from "../constant";
import {
  usePixelArtEditorContext,
  usePixelArtEditorCopyContext,
} from "../PixelArtEditorContext";
import { KNITTING_SYMBOLS, Shape } from "../Shape.constants";

import { ShortcutTooltip } from "@/components/common/Tootip";
import { cn } from "@/lib/utils";

export default function Toolbar() {
  const brushSubMenuList = useBrushSubMenuList();

  const isOpenSubMenu = brushSubMenuList.length > 0;

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
      {isOpenSubMenu && <SubMenu list={brushSubMenuList} />}

      <div
        className={cn(
          "flex gap-8 items-center justify-center",
          isOpenSubMenu && "py-2"
        )}
      >
        <SymbolButton isOpenSubMenu={isOpenSubMenu} />
        <MenuButton
          brushTool={BrushTool.SELECT}
          isOpenSubMenu={isOpenSubMenu}
          label="브러시"
          selectedIcon={<SelectIcon size={19} color="#1C1F25" />}
          unselectedIcon={<SelectIcon size={19} color="#79829F" />}
          shortcutLabel="선택"
          shortcutKey="S"
        />
        <MenuButton
          brushTool={BrushTool.PALETTE}
          isOpenSubMenu={isOpenSubMenu}
          label="색상"
          selectedIcon={<PaletteIcon color="#4B5162" />}
          unselectedIcon={<PaletteIcon color="#79829F" />}
          shortcutLabel="색상"
          shortcutKey="P"
        />
        <MenuButton
          brushTool={BrushTool.ERASER}
          isOpenSubMenu={isOpenSubMenu}
          label="지우개"
          selectedIcon={<EraserIcon color="#1C1F25" />}
          unselectedIcon={<EraserIcon color="#9EA5BD" />}
          shortcutLabel="지우개"
          shortcutKey="E"
        />
      </div>
    </div>
  );
}

function SymbolButton({ isOpenSubMenu }: { isOpenSubMenu: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  const { selectedShape, setSelectedShape } = usePixelArtEditorContext();
  const { brushTool } = usePixelArtEditorContext();
  const { selectionBackgroundColor } = usePixelArtEditorContext();

  const isSelected = brushTool === BrushTool.DOT && isOpen;

  const onShapeSelect = (shape: Shape) => {
    setSelectedShape({ ...shape, bgColor: selectionBackgroundColor });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <MenuButton
        onClick={() => setIsOpen(!isOpen)}
        brushTool={BrushTool.DOT}
        isOpenSubMenu={isOpenSubMenu}
        label="기호"
        selectedIcon={<RenderShapeIcon shape={selectedShape} size={16} />}
        unselectedIcon={<RenderShapeIcon shape={selectedShape} size={16} />}
        shortcutLabel="기호도구"
        shortcutKey="Q"
      />

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
              <RenderShapeIcon shape={shape} />
            </button>
          ))}
        </div>
      )}
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

function SubMenu({
  list,
}: {
  list: { content: React.ReactNode; name: string; onClick: () => void }[];
}) {
  return (
    <div
      className={cn(" flex flex-nowrap gap-3", "border-b border-neutral-N600")}
    >
      {list.map((item) => (
        <button
          key={item.name}
          className="disabled:opacity-50 disabled:pointer-events-none"
          onClick={item.onClick}
        >
          {item.content}
        </button>
      ))}
    </div>
  );
}

const useBrushSubMenuList = () => {
  const { brushTool, setSelectionBackgroundColor } = usePixelArtEditorContext();
  const { selectedShape, setSelectedShape } = usePixelArtEditorContext();

  const onColorSelect = (color: SelectionBackgroundColorType) => {
    setSelectionBackgroundColor(color);
    setSelectedShape({
      ...selectedShape,
      bgColor: color,
    });
  };

  const { copy, paste, cut, flipHorizontal, flipVertical } =
    usePixelArtEditorCopyContext();

  const selectSubMenuList = [
    {
      name: "복사",
      onClick: copy,
      content: (
        <div className="flex flex-col items-center py-1 px-3">
          <PasteIcon />
          <p className="text-neutral-N500 text-[16px] mt-1 whitespace-nowrap">
            복사
          </p>
        </div>
      ),
    },
    {
      name: "붙여넣기",
      onClick: paste,
      content: (
        <div className="flex flex-col items-center py-1 px-3">
          <CopyIcon />
          <p className="text-neutral-N500 text-[16px] mt-1 whitespace-nowrap">
            붙여넣기
          </p>
        </div>
      ),
    },
    {
      content: (
        <div className="flex flex-col items-center py-1 px-3">
          <CutIcon />
          <p className="text-neutral-N500 text-[16px] mt-1 whitespace-nowrap">
            잘라내기
          </p>
        </div>
      ),
      name: "잘라내기",
      onClick: cut,
    },
    {
      name: "좌우반전",
      onClick: flipHorizontal,
      content: (
        <div className="flex flex-col items-center py-1 px-3">
          <FlipVerticalIcon />
          <p className="text-neutral-N500 text-[16px] mt-1 whitespace-nowrap">
            좌우반전
          </p>
        </div>
      ),
    },
    {
      name: "상하반전",
      onClick: flipVertical,
      content: (
        <div className="flex flex-col items-center py-1 px-3">
          <FlipHorizontalIcon />
          <p className="text-neutral-N500 text-[16px] mt-1 whitespace-nowrap">
            상하반전
          </p>
        </div>
      ),
    },
  ];

  const paletteSubMenuList = Object.entries(SELECTION_BACKGROUND_COLORS).map(
    ([key, color]) => ({
      name: key,
      onClick: () => onColorSelect(color),
      content: (
        <div className="flex flex-col items-center py-1 px-3">
          <div
            className="w-10 h-10 rounded-sm"
            style={{ backgroundColor: color }}
          />
        </div>
      ),
    })
  );

  const submenuList = (() => {
    switch (brushTool) {
      case BrushTool.SELECT:
        return selectSubMenuList;
      case BrushTool.PALETTE:
        return paletteSubMenuList;
      default:
        return [];
    }
  })();

  return submenuList;
};

function MenuButton({
  brushTool: menuBrushTool,
  onClick,
  isOpenSubMenu,
  label,
  selectedIcon,
  unselectedIcon,
  shortcutLabel,
  shortcutKey,
}: {
  brushTool: BrushToolType;
  onClick?: () => void;
  isOpenSubMenu: boolean;
  label: string;
  selectedIcon: React.ReactNode;
  unselectedIcon: React.ReactNode;
  shortcutLabel: string;
  shortcutKey: string;
}) {
  const { brushTool, setBrushTool } = usePixelArtEditorContext();
  return (
    <ShortcutTooltip
      content={<div>{shortcutLabel}</div>}
      shortcut={shortcutKey}
    >
      <button
        onClick={() => {
          setBrushTool(menuBrushTool);
          onClick?.();
        }}
        className="flex flex-col items-center"
      >
        <div
          className={cn(
            menuStyle,
            isOpenSubMenu && brushTool === menuBrushTool && selectedMenuStyle
          )}
        >
          {isOpenSubMenu ? selectedIcon : unselectedIcon}
        </div>

        {!isOpenSubMenu && (
          <p className={menuTextStyle(brushTool === menuBrushTool)}>{label}</p>
        )}
      </button>
    </ShortcutTooltip>
  );
}

function RenderShapeIcon({
  shape,
  size = 28,
}: {
  shape: Shape;
  size?: number;
}) {
  return (
    <canvas
      width={size}
      height={size}
      ref={(canvas) => {
        if (canvas) {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.clearRect(0, 0, size, size);
            shape.render(ctx, 0, 0, size, shape.color, shape.bgColor);
          }
        }
      }}
    />
  );
}
