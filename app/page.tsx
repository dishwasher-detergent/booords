import { Board } from "@/components/ui/board";
import { BoardContainer } from "@/components/ui/board-container";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <BoardContainer>
        <Board title="Something 1" />
        <Board title="Something 2" />
        <Board title="Something 3" />
      </BoardContainer>
    </main>
  );
}
