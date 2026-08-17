export function useMemory() {
  const context = useContext(MemoryContext);

  if (!context) {
    throw new Error("useMemory must be used inside MemoryProvider");
  }

  return context;
}
