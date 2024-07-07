"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LucideEllipsis, LucideLayoutTemplate, LucidePlus } from "lucide-react";
import { BoardArea } from "./board-area";
import { Button } from "./button";

interface BoardProps {
  id: string;
  title: string;
  children?: React.ReactNode;
  items: any[];
}

const Board = ({ id, title, children, items }: BoardProps) => {
  const { setNodeRef, listeners, transform, transition } = useSortable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
      className="h-auto w-80 flex-none"
    >
      <div className="space-y-2 rounded-xl border border-dashed bg-background p-4">
        <header className="flex flex-row flex-nowrap items-center gap-2">
          <h2 className="flex-1 truncate pl-2 text-sm font-semibold text-muted-foreground">
            {title}
          </h2>
          <Button size="icon" variant="ghost">
            <LucideEllipsis className="size-4" />
          </Button>
        </header>
        <BoardArea id={id} items={items} />
        <footer className="flex flex-row flex-nowrap items-center gap-2">
          <Button className="flex-1 justify-start px-2" variant="ghost">
            <LucidePlus className="mr-2 size-4" />
            Add a card
          </Button>
          <Button size="icon" variant="ghost">
            <LucideLayoutTemplate className="size-4" />
          </Button>
        </footer>
      </div>
    </div>
  );
};

export { Board };
