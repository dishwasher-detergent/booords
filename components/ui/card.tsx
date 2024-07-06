import { cn } from "@/lib/utils";
import {
  LucideAlignLeft,
  LucideCheckSquare,
  LucideClock,
  LucidePaperclip,
} from "lucide-react";
import React from "react";

const Card = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => {
  return (
    <li
      className={cn(
        "w-full overflow-hidden rounded-xl border border-dashed hover:border-primary hover:bg-primary/5",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});

Card.displayName = "Card";

const CardContainer = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => {
  return <ul className={cn("space-y-2", className)} ref={ref} {...props} />;
});

CardContainer.displayName = "CardContainer";

const CardCover = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      className={cn("aspect-square w-full bg-primary", className)}
      ref={ref}
      {...props}
    />
  );
});

CardCover.displayName = "CardCover";

const CardLabelContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      className={cn("grid grid-cols-6 gap-1", className)}
      ref={ref}
      {...props}
    />
  );
});

CardLabelContainer.displayName = "CardLabelContainer";

const CardLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      className={cn("h-2 w-full rounded-full bg-primary", className)}
      ref={ref}
      {...props}
    />
  );
});

CardLabel.displayName = "CardLabel";

const CardBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div className={cn("space-y-2 p-3", className)} ref={ref} {...props} />
  );
});

CardBody.displayName = "CardBody";

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  return <h4 className={cn("font-semibold", className)} ref={ref} {...props} />;
});

CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p className={cn("line-clamp-3 text-sm", className)} ref={ref} {...props} />
  );
});

CardDescription.displayName = "CardDescription";

const CardDetails = ({ date, description, attachment, checklist }: any) => {
  return (
    <div className="flex flex-row gap-4">
      {date && (
        <div className="flex flex-row items-center gap-1">
          <LucideClock className="size-3" />
          <p className="text-xs">{date}</p>
        </div>
      )}
      {description && (
        <div className="flex flex-row items-center gap-1">
          <LucideAlignLeft className="size-3" />
        </div>
      )}
      {attachment && (
        <div className="flex flex-row items-center gap-1">
          <LucidePaperclip className="size-3" />
          <p className="text-xs">{attachment}</p>
        </div>
      )}
      {checklist && (
        <div className="flex flex-row items-center gap-1">
          <LucideCheckSquare className="size-3" />
          <p className="text-xs">0/{checklist}</p>
        </div>
      )}
    </div>
  );
};

CardDetails.displayName = "CardDetails";

export {
  Card,
  CardBody,
  CardContainer,
  CardCover,
  CardDescription,
  CardDetails,
  CardLabel,
  CardLabelContainer,
  CardTitle,
};
