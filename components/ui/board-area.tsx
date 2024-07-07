"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { BoardCard } from "./board-card";
import { CardContainer } from "./card";

interface BoardAreaProps {
  id: string;
  items: any[];
}

const BoardArea = ({ id, items }: BoardAreaProps) => {
  const { setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <CardContainer ref={setNodeRef}>
      <SortableContext
        items={items}
        id={id}
        strategy={verticalListSortingStrategy}
      >
        {items.map((task, index) => (
          <BoardCard title={task} key={index} />
        ))}
        {items.length == 0 && (
          <div className="h-24 w-full rounded-xl bg-muted" />
        )}
      </SortableContext>
    </CardContainer>
  );
};

export { BoardArea };
