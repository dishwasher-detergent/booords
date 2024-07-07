interface BoardContainerProps {
  children: React.ReactNode;
}

const BoardContainer = ({ children }: BoardContainerProps) => {
  return (
    <section className="flex h-full flex-row justify-start gap-4 overflow-x-auto p-4">
      {children}
    </section>
  );
};

export { BoardContainer };
