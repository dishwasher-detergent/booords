"use client";

import { Board } from "@/components/ui/board";
import { BoardCard } from "@/components/ui/board-card";
import { BoardContainer } from "@/components/ui/board-container";
import { Button } from "@/components/ui/button";
import { createRange } from "@/lib/utils";
import {
  CollisionDetection,
  DndContext,
  DragOverlay,
  DropAnimation,
  MeasuringStrategy,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  closestCenter,
  defaultDropAnimation,
  getFirstCollision,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { LucidePlus } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";

type Items = Record<string, string[]>;

export const TRASH_ID = "void";
export const PLACEHOLDER_ID = "placeholder";

export default function Home() {
  const [items, setItems] = useState<any>(() => ({
    A: createRange(5, (index) => `A${index + 1}`),
    B: createRange(5, (index) => `B${index + 1}`),
    C: createRange(5, (index) => `C${index + 1}`),
    D: createRange(5, (index) => `D${index + 1}`),
  }));
  const [containers, setContainers] = useState(Object.keys(items));
  const [activeId, setActiveId] = useState<string | null>(null);
  const lastOverId = useRef<UniqueIdentifier | null>(null);
  const recentlyMovedToNewContainer = useRef(false);

  const collisionDetectionStrategy: CollisionDetection = useCallback(
    (args) => {
      if (activeId && activeId in items) {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(
            (container) => container.id in items,
          ),
        });
      }

      const pointerIntersections = pointerWithin(args);
      const intersections =
        pointerIntersections.length > 0
          ? pointerIntersections
          : rectIntersection(args);
      let overId = getFirstCollision(intersections, "id");

      if (overId != null) {
        if (overId === TRASH_ID) {
          return intersections;
        }

        if (overId in items) {
          const containerItems = items[overId];

          if (containerItems.length > 0) {
            overId = closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                (container) =>
                  container.id !== overId &&
                  containerItems.includes(container.id),
              ),
            })[0]?.id;
          }
        }

        lastOverId.current = overId;

        return [{ id: overId }];
      }

      if (recentlyMovedToNewContainer.current) {
        lastOverId.current = activeId;
      }

      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [activeId, items],
  );
  const [clonedItems, setClonedItems] = useState<Items | null>(null);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const findContainer = (id: string) => {
    if (id in items) {
      return id;
    }

    return Object.keys(items).find((key) => items[key].includes(id));
  };

  const getIndex = (id: string) => {
    const container = findContainer(id);

    if (!container) {
      return -1;
    }

    const index = items[container].indexOf(id);

    return index;
  };

  const dropAnimation: DropAnimation = {
    ...defaultDropAnimation,
  };

  const onDragCancel = () => {
    if (clonedItems) {
      setItems(clonedItems);
    }

    setActiveId(null);
    setClonedItems(null);
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false;
    });
  }, [items]);

  function handleRemove(containerID: UniqueIdentifier) {
    setContainers((containers) =>
      containers.filter((id) => id !== containerID),
    );
  }

  function getNextContainerId() {
    const containerIds = Object.keys(items);
    const lastContainerId = containerIds[containerIds.length - 1];

    return String.fromCharCode(lastContainerId.charCodeAt(0) + 1);
  }

  function handleAddColumn() {
    const newContainerId = getNextContainerId();

    unstable_batchedUpdates(() => {
      setContainers((containers) => [...containers, newContainerId]);
      setItems((items: any) => ({
        ...items,
        [newContainerId]: [],
      }));
    });
  }

  return (
    <main className="flex min-h-screen flex-col">
      <BoardContainer>
        <DndContext
          sensors={sensors}
          collisionDetection={collisionDetectionStrategy}
          measuring={{
            droppable: {
              strategy: MeasuringStrategy.Always,
            },
          }}
          onDragStart={({ active }) => {
            setActiveId(active.id.toString());
            setClonedItems(items);
          }}
          onDragOver={({ active, over }) => {
            const overId = over?.id;

            if (!overId || overId === TRASH_ID || active.id in items) {
              return;
            }

            const overContainer = findContainer(overId.toString());
            const activeContainer = findContainer(active.id.toString());

            if (!overContainer || !activeContainer) {
              return;
            }

            if (activeContainer !== overContainer) {
              setItems((items: any) => {
                const activeItems = items[activeContainer];
                const overItems = items[overContainer];
                const overIndex = overItems.indexOf(overId.toString());
                const activeIndex = activeItems.indexOf(active.id.toString());

                let newIndex: number;

                if (overId in items) {
                  newIndex = overItems.length + 1;
                } else {
                  const isBelowOverItem =
                    over &&
                    active.rect.current.translated &&
                    active.rect.current.translated.top >
                      over.rect.top + over.rect.height;

                  const modifier = isBelowOverItem ? 1 : 0;

                  newIndex =
                    overIndex >= 0
                      ? overIndex + modifier
                      : overItems.length + 1;
                }

                recentlyMovedToNewContainer.current = true;

                return {
                  ...items,
                  [activeContainer]: items[activeContainer].filter(
                    (item: any) => item !== active.id,
                  ),
                  [overContainer]: [
                    ...items[overContainer].slice(0, newIndex),
                    items[activeContainer][activeIndex],
                    ...items[overContainer].slice(
                      newIndex,
                      items[overContainer].length,
                    ),
                  ],
                };
              });
            }
          }}
          onDragEnd={({ active, over }) => {
            if (active.id in items && over?.id) {
              setContainers((containers) => {
                const activeIndex = containers.indexOf(active.id.toString());
                const overIndex = containers.indexOf(over.id.toString());

                return arrayMove(containers, activeIndex, overIndex);
              });
            }

            const activeContainer = findContainer(active.id.toString());

            if (!activeContainer) {
              setActiveId(null);
              return;
            }

            const overId = over?.id;

            if (!overId) {
              setActiveId(null);
              return;
            }

            if (overId === TRASH_ID) {
              setItems((items: any) => ({
                ...items,
                [activeContainer]: items[activeContainer].filter(
                  (id: any) => id !== activeId,
                ),
              }));
              setActiveId(null);
              return;
            }

            if (overId === PLACEHOLDER_ID) {
              const newContainerId = getNextContainerId();

              unstable_batchedUpdates(() => {
                setContainers((containers) => [...containers, newContainerId]);
                setItems((items: any) => ({
                  ...items,
                  [activeContainer]: items[activeContainer].filter(
                    (id: any) => id !== activeId,
                  ),
                  [newContainerId]: [active.id],
                }));
                setActiveId(null);
              });
              return;
            }

            const overContainer = findContainer(overId.toString());

            if (overContainer) {
              const activeIndex = items[activeContainer].indexOf(active.id);
              const overIndex = items[overContainer].indexOf(overId);

              if (activeIndex !== overIndex) {
                setItems((items: any) => ({
                  ...items,
                  [overContainer]: arrayMove(
                    items[overContainer],
                    activeIndex,
                    overIndex,
                  ),
                }));
              }
            }

            setActiveId(null);
          }}
          onDragCancel={onDragCancel}
        >
          <SortableContext
            items={[...containers, PLACEHOLDER_ID]}
            strategy={horizontalListSortingStrategy}
          >
            {containers.map((key) => (
              <Board title={key} items={items[key]} />
            ))}
          </SortableContext>
          <DragOverlay adjustScale={true} dropAnimation={dropAnimation}>
            {activeId ? (
              containers.includes(activeId) ? (
                <Board
                  title={findContainer(activeId) ?? ""}
                  items={items[findContainer(activeId) ?? 0]}
                >
                  container
                </Board>
              ) : (
                <BoardCard
                  id={items[findContainer(activeId) ?? 0][getIndex(activeId)]}
                />
              )
            ) : null}
          </DragOverlay>
          <div className="w-80 flex-none">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleAddColumn}
            >
              <LucidePlus className="mr-2 size-4" />
              Add another list
            </Button>
          </div>
        </DndContext>
      </BoardContainer>
    </main>
  );
}
