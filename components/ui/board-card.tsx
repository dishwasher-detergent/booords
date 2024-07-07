"use client";

import {
  Card,
  CardBody,
  CardDetails,
  CardLabel,
  CardLabelContainer,
  CardTitle,
} from "@/components/ui/card";
import { useMountStatus } from "@/hooks/useMountStatus";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface BoardCardProps {
  id: string;
}

const BoardCard = ({ id }: BoardCardProps) => {
  const {
    setNodeRef,
    listeners,
    isDragging,
    isSorting,
    over,
    overIndex,
    transform,
    transition,
  } = useSortable({
    id,
  });
  const mounted = useMountStatus();
  const mountedWhileDragging = isDragging && !mounted;

  return (
    <Card
      className="bg-background transition-[rotate]"
      ref={setNodeRef}
      {...listeners}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {/* <CardCover /> */}
      <CardBody>
        <CardLabelContainer>
          <CardLabel />
          <CardLabel />
          <CardLabel />
          <CardLabel />
          <CardLabel />
          <CardLabel />
          <CardLabel />
          <CardLabel />
        </CardLabelContainer>
        <CardTitle>{id}</CardTitle>
        {/* <CardDescription>
          Testing Testing Testing Testing Testing Testing Testing TestingTesting
          Testing Testing Testing Testing TestingTesting
        </CardDescription> */}
        <CardDetails
          date="Jul 8"
          description={true}
          attachment={2}
          checklist={6}
        />
      </CardBody>
    </Card>
  );
};

export { BoardCard };
