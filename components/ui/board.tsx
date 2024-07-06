import { LucideEllipsis, LucideLayoutTemplate, LucidePlus } from "lucide-react";
import { Button } from "./button";
import {
  Card,
  CardBody,
  CardContainer,
  CardCover,
  CardDescription,
  CardDetails,
  CardLabel,
  CardLabelContainer,
  CardTitle,
} from "./card";

const Board = ({ title }: { title?: string }) => {
  return (
    <div className="flex-1 space-y-2 rounded-xl border border-dashed p-4">
      <header className="flex flex-row flex-nowrap items-center gap-2">
        <h2 className="flex-1 truncate pl-2 text-sm font-semibold text-muted-foreground">
          {title}
        </h2>
        <Button size="icon" variant="ghost">
          <LucideEllipsis className="size-4" />
        </Button>
      </header>
      <CardContainer>
        <Card>
          <CardCover />
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
            <CardTitle>Card Title</CardTitle>
            <CardDescription>
              Testing Testing Testing Testing Testing Testing Testing
              TestingTesting Testing Testing Testing Testing TestingTesting
            </CardDescription>
            <CardDetails
              date="Jul 8"
              description={true}
              attachment={2}
              checklist={6}
            />
          </CardBody>
        </Card>
      </CardContainer>
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
  );
};

export { Board };
