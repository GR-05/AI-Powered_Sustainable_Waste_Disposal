
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WasteType, wasteTypes, defaultDisposalLimits } from '@/lib/wasteData';

type WasteCount = {
  id: string;
  count: number;
  timestamp: Date;
};

type UserWaste = {
  wastes: WasteCount[];
  disposalLimits: Record<string, number>;
};

interface WasteContextType {
  identifiedWaste: WasteType | null;
  userWaste: UserWaste;
  setIdentifiedWaste: (waste: WasteType | null) => void;
  addWaste: (wasteId: string, count?: number) => void;
  removeWaste: (wasteId: string) => void;
  clearWaste: () => void;
  updateDisposalLimit: (category: string, limit: number) => void;
  isOverLimit: (category: string) => boolean;
  getTodayWasteCount: (category: string) => number;
  getWasteById: (id: string) => WasteType | undefined;
  searchWaste: (query: string) => WasteType[];
}

const defaultUserWaste: UserWaste = {
  wastes: [],
  disposalLimits: { ...defaultDisposalLimits }
};

export const WasteContext = createContext<WasteContextType | undefined>(undefined);

export const WasteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [identifiedWaste, setIdentifiedWaste] = useState<WasteType | null>(null);
  const [userWaste, setUserWaste] = useState<UserWaste>(() => {
    const saved = localStorage.getItem('userWaste');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Convert string dates back to Date objects
        if (parsed.wastes) {
          parsed.wastes = parsed.wastes.map((w: any) => ({
            ...w,
            timestamp: new Date(w.timestamp)
          }));
        }
        return parsed;
      } catch (e) {
        console.error('Failed to parse user waste data', e);
        return defaultUserWaste;
      }
    }
    return defaultUserWaste;
  });

  useEffect(() => {
    // Save to localStorage whenever userWaste changes
    localStorage.setItem('userWaste', JSON.stringify(userWaste));
  }, [userWaste]);

  const addWaste = (wasteId: string, count = 1) => {
    setUserWaste(prev => {
      const now = new Date();
      const existingIndex = prev.wastes.findIndex(w => w.id === wasteId);
      
      const newWastes = [...prev.wastes];
      if (existingIndex >= 0) {
        // Update existing entry
        newWastes[existingIndex] = {
          ...newWastes[existingIndex],
          count: newWastes[existingIndex].count + count,
          timestamp: now
        };
      } else {
        // Add new entry
        newWastes.push({ id: wasteId, count, timestamp: now });
      }
      
      return { ...prev, wastes: newWastes };
    });
  };

  const removeWaste = (wasteId: string) => {
    setUserWaste(prev => {
      const newWastes = prev.wastes.filter(w => w.id !== wasteId);
      return { ...prev, wastes: newWastes };
    });
  };

  const clearWaste = () => {
    setUserWaste({ ...defaultUserWaste });
  };

  const updateDisposalLimit = (category: string, limit: number) => {
    setUserWaste(prev => {
      const newLimits = { ...prev.disposalLimits, [category]: limit };
      return { ...prev, disposalLimits: newLimits };
    });
  };

  // Get waste count for today by category
  const getTodayWasteCount = (category: string): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get waste items from today for the specified category
    return userWaste.wastes
      .filter(waste => {
        const wasteItem = wasteTypes.find(w => w.id === waste.id);
        const wasteDate = new Date(waste.timestamp);
        wasteDate.setHours(0, 0, 0, 0);
        
        return wasteItem?.category === category && wasteDate.getTime() === today.getTime();
      })
      .reduce((total, waste) => total + waste.count, 0);
  };

  const isOverLimit = (category: string): boolean => {
    const limit = userWaste.disposalLimits[category] || defaultDisposalLimits[category as keyof typeof defaultDisposalLimits] || 0;
    const count = getTodayWasteCount(category);
    return count > limit;
  };

  const getWasteById = (id: string): WasteType | undefined => {
    return wasteTypes.find(waste => waste.id === id);
  };

  const searchWaste = (query: string): WasteType[] => {
    const lowercaseQuery = query.toLowerCase();
    return wasteTypes.filter(waste => 
      waste.name.toLowerCase().includes(lowercaseQuery) ||
      waste.description.toLowerCase().includes(lowercaseQuery) ||
      waste.category.toLowerCase().includes(lowercaseQuery)
    );
  };

  return (
    <WasteContext.Provider
      value={{
        identifiedWaste,
        userWaste,
        setIdentifiedWaste,
        addWaste,
        removeWaste,
        clearWaste,
        updateDisposalLimit,
        isOverLimit,
        getTodayWasteCount,
        getWasteById,
        searchWaste
      }}
    >
      {children}
    </WasteContext.Provider>
  );
};

export const useWaste = (): WasteContextType => {
  const context = useContext(WasteContext);
  if (context === undefined) {
    throw new Error('useWaste must be used within a WasteProvider');
  }
  return context;
};
