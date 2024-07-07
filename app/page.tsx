import { BoardContainer } from "@/components/ui/board-container";
import { Container } from "@/interfaces/container.interface";
import { Task } from "@/interfaces/task.interface";
import { database_service } from "@/lib/appwrite";
import { Query } from "appwrite";

type Items = {
  [key: string]: Task[];
};

const getContainers = async () => {
  const containers = await database_service.list<Container>("containers");

  return containers.documents;
};

const getTasks = async (container: Container): Promise<Items> => {
  const tasks = await database_service.list<Task>("tasks", [
    Query.equal("container", container.$id),
  ]);

  return {
    [container.title]: tasks.documents,
  };
};

const transform = (input: Items[]) => {
  const result: Items = {};

  input.forEach((item) => {
    for (const key in item) {
      item[key].forEach((subItem) => {
        if (!result[key]) {
          result[key] = [subItem];
        } else {
          result[key] = [...result[key], subItem];
        }
      });
    }
  });

  return result;
};

export default async function Home() {
  const containers = await getContainers();
  const tasks = await Promise.all(
    containers.map((container) => {
      return getTasks(container);
    }),
  );

  const transformedTasks = transform(tasks);

  return (
    <main className="flex min-h-screen flex-col">
      <BoardContainer tasks={transformedTasks} />
    </main>
  );
}
