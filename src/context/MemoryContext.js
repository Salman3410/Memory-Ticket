import { createContext, useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { getNetworkInfo } from "../services/networkService";

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
  // GET NETWORK INFO
  // --------------------------------------------------

  const getEnvironmentInfo = async () => {
    let network = null;

    try {
      network = await getNetworkInfo();
    } catch (error) {
      console.log("Memory network error:", error);
    }

    return {
      network,
    };
  };

  // --------------------------------------------------
  // ADD MEMORY
  // --------------------------------------------------

  const addMemory = async (memory) => {
    try {
      const images = Array.isArray(memory?.images)
        ? memory.images
        : memory?.image
          ? [memory.image]
          : [];

      const environment = await getEnvironmentInfo();

      // --------------------------------------------------
      // LOCATION DATA
      //
      // location = human-readable text
      // locationData = exact GPS coordinates
      // --------------------------------------------------

      const location = memory?.location || "";

      const locationData = memory?.locationData || null;

      // --------------------------------------------------
      // CREATE MEMORY
      // --------------------------------------------------

      const newMemory = {
        ...memory,

        // Backwards compatibility
        image: images[0] || null,

        // All images
        images,

        description: memory?.description || "",

        // Human-readable location
        location,

        // Exact GPS location
        locationData,

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

        // Always keep images as array
        images: updatedImages,

        // Keep description
        description:
          updatedData?.description !== undefined
            ? updatedData.description
            : memory.description || "",

        // Keep human-readable location
        location:
          updatedData?.location !== undefined
            ? updatedData.location
            : memory.location || "",

        // Keep exact GPS location
        locationData:
          updatedData?.locationData !== undefined
            ? updatedData.locationData
            : memory.locationData || null,

        // Keep existing environment
        environment:
          updatedData?.environment !== undefined
            ? updatedData.environment
            : memory.environment || null,

        // Update timestamp
        updatedAt: new Date().toISOString(),
      };

      // First image compatibility
      updatedMemory.image = updatedImages[0] || null;

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
