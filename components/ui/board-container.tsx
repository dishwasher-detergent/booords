const BoardContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="flex flex-row justify-evenly gap-4 p-4">
      {children}
    </section>
  );
};

export { BoardContainer };
