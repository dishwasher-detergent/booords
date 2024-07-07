"use client";

import {
  Card,
  CardBody,
  CardDetails,
  CardLabel,
  CardLabelContainer,
  CardTitle,
} from "@/components/ui/card";
import { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface BoardCardProps {
  title: string | UniqueIdentifier;
}

const BoardCard = ({ title }: BoardCardProps) => {
  const { setNodeRef, listeners, transform, transition } = useSortable({
    id: title,
  });

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
        <CardTitle>{title}</CardTitle>
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
