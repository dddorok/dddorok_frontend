"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface ChartTypeOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chartTypes: { chart_type_id: string; name: string; order: number }[];
  onSave: (newOrder: { chart_type_id: string; order: number }[]) => void;
}

function SortableItem({ id, name }: { id: string; name: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: "8px",
    border: "1px solid #e5e7eb",
    borderRadius: "4px",
    marginBottom: "8px",
    background: "#fff",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <span style={{ cursor: "grab" }}>☰</span>
      <span>{name}</span>
    </div>
  );
}

export function ChartTypeOrderDialog({
  open,
  onOpenChange,
  chartTypes,
  onSave,
}: ChartTypeOrderDialogProps) {
  const [items, setItems] = React.useState(chartTypes);

  React.useEffect(() => {
    setItems(chartTypes);
  }, [chartTypes, open]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = items.findIndex(
        (item) => item.chart_type_id === active.id
      );
      const newIndex = items.findIndex(
        (item) => item.chart_type_id === over.id
      );
      const newItems = arrayMove(items, oldIndex, newIndex).map(
        (item, idx) => ({
          ...item,
          order: idx,
        })
      );
      setItems(newItems);
    }
  };

  const handleSave = () => {
    onSave(items.map(({ chart_type_id, order }) => ({ chart_type_id, order })));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>차트 유형 순서 변경</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items.map((item) => item.chart_type_id)}
              strategy={verticalListSortingStrategy}
            >
              {items.map((item) => (
                <SortableItem
                  key={item.chart_type_id}
                  id={item.chart_type_id}
                  name={item.name}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleSave}>저장</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
