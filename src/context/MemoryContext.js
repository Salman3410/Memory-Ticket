import React, { createContext, useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

export const MemoryContext = createContext(null);

const STORAGE_KEY = "@memory_ticket_memories";

export function MemoryProvider({ children }) {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  // --------------------------------------------------
  // LOAD MEMORIES
  // --------------------------------------------------

  useEffect(() => {
    loadMemories();
  }, []);

  const loadMemories = async () => {
    try {
      const storedMemories = await AsyncStorage.getItem(STORAGE_KEY);

      if (storedMemories) {
        const parsedMemories = JSON.parse(storedMemories);

        if (Array.isArray(parsedMemories)) {
          setMemories(parsedMemories);
        } else {
          setMemories([]);
        }
      } else {
        setMemories([]);
      }
    } catch (error) {
      console.log("Error loading memories:", error);
      setMemories([]);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // SAVE MEMORIES
  // --------------------------------------------------

  const persistMemories = async (updatedMemories) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMemories));
    } catch (error) {
      console.log("Error saving memories:", error);
    }
  };

  // --------------------------------------------------
  // ADD MEMORY
  // --------------------------------------------------

  const addMemory = async (memory) => {
    const images = Array.isArray(memory?.images)
      ? memory.images
      : memory?.image
        ? [memory.image]
        : [];

    const newMemory = {
      ...memory,

      // Keep first image for backwards compatibility
      image: images[0] || null,

      // Store all images
      images,

      description: memory?.description || "",

      id: Date.now().toString() + Math.random().toString(36).substring(2, 8),

      createdAt: new Date().toISOString(),

      favorite: memory?.favorite || false,
    };

    const updatedMemories = [newMemory, ...memories];

    setMemories(updatedMemories);

    await persistMemories(updatedMemories);

    return newMemory;
  };

  // --------------------------------------------------
  // DELETE MEMORY
  // --------------------------------------------------

  const deleteMemory = async (memoryId) => {
    const updatedMemories = memories.filter((memory) => memory.id !== memoryId);

    setMemories(updatedMemories);

    await persistMemories(updatedMemories);
  };

  // --------------------------------------------------
  // UPDATE MEMORY
  // --------------------------------------------------

  const updateMemory = async (memoryId, updatedData) => {
    let updatedMemory = null;

    const updatedMemories = memories.map((memory) => {
      if (memory.id !== memoryId) {
        return memory;
      }

      updatedMemory = {
        ...memory,
        ...updatedData,

        // Keep multi-image structure consistent
        images: Array.isArray(updatedData?.images)
          ? updatedData.images
          : Array.isArray(memory.images)
            ? memory.images
            : memory.image
              ? [memory.image]
              : [],

        description:
          updatedData?.description !== undefined
            ? updatedData.description
            : memory.description || "",

        updatedAt: new Date().toISOString(),
      };

      // Keep old `image` field synchronized
      updatedMemory.image = updatedMemory.images?.[0] || null;

      return updatedMemory;
    });

    setMemories(updatedMemories);

    await persistMemories(updatedMemories);

    return updatedMemory;
  };

  // --------------------------------------------------
  // FIND MEMORY
  // --------------------------------------------------

  const getMemoryById = (memoryId) => {
    return memories.find((memory) => memory.id === memoryId);
  };

  // --------------------------------------------------
  // CLEAR ALL MEMORIES
  // --------------------------------------------------

  const clearMemories = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);

      setMemories([]);
    } catch (error) {
      console.log("Error clearing memories:", error);
    }
  };

  // --------------------------------------------------
  // PROVIDER
  // --------------------------------------------------

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
