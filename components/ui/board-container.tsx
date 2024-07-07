"use client";

import { Board } from "@/components/ui/board";
import { Button } from "@/components/ui/button";
import { Task } from "@/interfaces/task.interface";
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

type Items = {
  [key: string]: Task[];
};

interface BoardContainerProps {
  tasks: Items;
}

export const TRASH_ID = "void";
export const PLACEHOLDER_ID = "placeholder";

const BoardContainer = ({ tasks: initialTasks }: BoardContainerProps) => {
  const [items, setItems] = useState<Items>(initialTasks);
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
                  containerItems.filter((x) => x.$id === container.id).length >
                    0,
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

    return Object.keys(items).find(
      (key) => items[key].filter((x) => x.$id == id).length > 0,
    );
  };

  const getIndex = (id: string) => {
    const container = findContainer(id);

    if (!container) {
      return -1;
    }

    const index = items[container].findIndex((x) => x.$id == id);

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
      setItems((items) => ({
        ...items,
        [newContainerId]: [],
      }));
    });
  }

  return (
    <section className="flex h-full flex-row justify-start gap-4 overflow-x-auto p-4">
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
            setItems((items) => {
              const activeItems = items[activeContainer];
              const overItems = items[overContainer];
              const overIndex = overItems.findIndex((x) => x.$id == overId);
              const activeIndex = activeItems.findIndex(
                (x) => x.$id == active.id,
              );

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
                  overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
              }

              recentlyMovedToNewContainer.current = true;

              return {
                ...items,
                [activeContainer]: items[activeContainer].filter(
                  (item) => item.$id !== active.id,
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
            setItems((items) => ({
              ...items,
              [activeContainer]: items[activeContainer].filter(
                (x) => x.$id !== activeId,
              ),
            }));
            setActiveId(null);
            return;
          }

          if (overId === PLACEHOLDER_ID) {
            const newContainerId = getNextContainerId();

            unstable_batchedUpdates(() => {
              setContainers((containers) => [...containers, newContainerId]);
              setItems((items) => ({
                ...items,
                [activeContainer]: items[activeContainer].filter(
                  (x) => x.$id !== activeId,
                ),
                [newContainerId]: items[active.id],
              }));
              setActiveId(null);
            });
            return;
          }

          const overContainer = findContainer(overId.toString());

          if (overContainer) {
            const activeIndex = items[activeContainer].findIndex(
              (x) => x.$id == active.id,
            );
            const overIndex = items[overContainer].findIndex(
              (x) => x.$id == overId,
            );

            if (activeIndex !== overIndex) {
              setItems((items) => ({
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
            <Board id={key} title={key} items={items[key]} />
          ))}
        </SortableContext>
        <DragOverlay adjustScale={true} dropAnimation={dropAnimation}>
          {activeId ? (
            containers.includes(activeId) ? (
              // <Board
              //   id={items[findContainer(activeId) ?? 0][0].container}
              //   title={findContainer(activeId) ?? ""}
              //   items={items[findContainer(activeId) ?? 0]}
              // />
              <p>container</p>
            ) : (
              // <BoardCard title="test" />
              <p>card</p>
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
    </section>
  );
};

export { BoardContainer };
