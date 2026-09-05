import { createContext, useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { getCurrentLocation } from "../services/locationService";
import { getNetworkInfo } from "../services/networkService";

export const MemoryContext = createContext(null);

const STORAGE_KEY = "@memory_ticket_memories";

export function MemoryProvider({ children }) {
  const [memories, setMemories] = useState([]);

  const [loading, setLoading] = useState(true);

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

  const persistMemories = async (updatedMemories) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMemories));
    } catch (error) {
      console.log("Error saving memories:", error);
    }
  };

  const getEnvironmentInfo = async () => {
    const [locationResult, networkResult] = await Promise.allSettled([
      getCurrentLocation(),
      getNetworkInfo(),
    ]);

    const location =
      locationResult.status === "fulfilled" ? locationResult.value : null;

    const network =
      networkResult.status === "fulfilled" ? networkResult.value : null;

    if (locationResult.status === "rejected") {
      console.log("Memory location error:", locationResult.reason);
    }

    if (networkResult.status === "rejected") {
      console.log("Memory network error:", networkResult.reason);
    }

    return {
      location,
      network,
    };
  };

  const addMemory = async (memory) => {
    try {
      const images = Array.isArray(memory?.images)
        ? memory.images
        : memory?.image
          ? [memory.image]
          : [];

      const environment = await getEnvironmentInfo();

      const newMemory = {
        ...memory,

        // Backwards compatibility
        image: images[0] || null,

        // Store all images
        images,

        description: memory?.description || "",

        id: Date.now().toString() + Math.random().toString(36).substring(2, 8),

        createdAt: new Date().toISOString(),

        favorite: memory?.favorite || false,

        environment,
      };

      const updatedMemories = [newMemory, ...memories];

      setMemories(updatedMemories);

      await persistMemories(updatedMemories);

      return newMemory;
    } catch (error) {
      console.log("Add memory error:", error);

      return null;
    }
  };

  const deleteMemory = async (memoryId) => {
    const updatedMemories = memories.filter((memory) => memory.id !== memoryId);

    setMemories(updatedMemories);

    await persistMemories(updatedMemories);
  };

  const updateMemory = async (memoryId, updatedData) => {
    let updatedMemory = null;

    const updatedMemories = memories.map((memory) => {
      if (memory.id !== memoryId) {
        return memory;
      }

      const updatedImages = Array.isArray(updatedData?.images)
        ? updatedData.images
        : updatedData?.image
          ? [updatedData.image]
          : Array.isArray(memory.images)
            ? memory.images
            : memory.image
              ? [memory.image]
              : [];

      updatedMemory = {
        ...memory,
        ...updatedData,

        // Always keep images as an array
        images: updatedImages,

        // Keep description
        description:
          updatedData?.description !== undefined
            ? updatedData.description
            : memory.description || "",

        // KEEP EXISTING ENVIRONMENT DATA
        environment:
          updatedData?.environment !== undefined
            ? updatedData.environment
            : memory.environment || null,

        // Update timestamp
        updatedAt: new Date().toISOString(),
      };

      updatedMemory.image = updatedImages[0] || null;

      return updatedMemory;
    });

    setMemories(updatedMemories);

    await persistMemories(updatedMemories);

    return updatedMemory;
  };

  const getMemoryById = (memoryId) => {
    return memories.find((memory) => memory.id === memoryId);
  };

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
