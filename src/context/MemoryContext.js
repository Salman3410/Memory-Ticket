import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
const MemoryContext = createContext();

const STORAGE_KEY = "@memory_ticket_memories";

export function MemoryProvider({ children }) {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMemories();
  }, []);

  // Load saved memories when app starts
  const loadMemories = async () => {
    try {
      const storedMemories = await AsyncStorage.getItem(STORAGE_KEY);

      if (storedMemories) {
        setMemories(JSON.parse(storedMemories));
      }
    } catch (error) {
      console.log("Error loading memories:", error);
    } finally {
      setLoading(false);
    }
  };

  // Save current memories to AsyncStorage
  const persistMemories = async (updatedMemories) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMemories));
    } catch (error) {
      console.log("Error saving memories:", error);
    }
  };

  // Add a new memory
  const addMemory = async (memory) => {
    const newMemory = {
      ...memory,
      id: Date.now().toString() + Math.random().toString(36).substring(2, 8),
      createdAt: new Date().toISOString(),
    };

    const updatedMemories = [newMemory, ...memories];

    setMemories(updatedMemories);

    await persistMemories(updatedMemories);

    return newMemory;
  };

  // Delete a memory
  const deleteMemory = async (memoryId) => {
    const updatedMemories = memories.filter((memory) => memory.id !== memoryId);

    setMemories(updatedMemories);

    await persistMemories(updatedMemories);
  };

  // Update a memory
  const updateMemory = async (memoryId, updatedData) => {
    const updatedMemories = memories.map((memory) =>
      memory.id === memoryId
        ? {
            ...memory,
            ...updatedData,
            updatedAt: new Date().toISOString(),
          }
        : memory,
    );

    setMemories(updatedMemories);

    await persistMemories(updatedMemories);
  };

  // Find one memory
  const getMemoryById = (memoryId) => {
    return memories.find((memory) => memory.id === memoryId);
  };

  // Delete everything
  const clearMemories = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setMemories([]);
    } catch (error) {
      console.log("Error clearing memories:", error);
    }
  };

  return (
    <MemoryContext.Provider
      value={{
        memories,
        loading,
        addMemory,
        deleteMemory,
        updateMemory,
        getMemoryById,
        clearMemories,
      }}
    >
      {children}
    </MemoryContext.Provider>
  );
}

export function useMemory() {
  const context = useContext(MemoryContext);

  if (!context) {
    throw new Error("useMemory must be used inside MemoryProvider");
  }

  return context;
}
