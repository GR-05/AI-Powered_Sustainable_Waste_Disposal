
import { useState } from 'react';
import { useWaste } from '@/context/WasteContext';
import { WasteType, wasteTypes, categories } from '@/lib/wasteData';
import { useToast } from '@/hooks/use-toast';

export const useWasteManagement = () => {
  const { 
    identifiedWaste, 
    setIdentifiedWaste, 
    addWaste, 
    isOverLimit, 
    getTodayWasteCount,
    updateDisposalLimit
  } = useWaste();
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [searchResults, setSearchResults] = useState<WasteType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  // Simulated AI identification
  const identifyWaste = async (imageFile: File | null) => {
    setIsIdentifying(true);
    
    try {
      // In a real app, we would send the image to an AI service
      // For demo purposes, we'll randomly select an item from our waste types
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (!imageFile) {
        throw new Error('No image provided');
      }
      
      // Simulate AI identification with a random waste item
      const randomIndex = Math.floor(Math.random() * wasteTypes.length);
      const identified = wasteTypes[randomIndex];
      
      setIdentifiedWaste(identified);
      
      toast({
        title: 'Waste Identified',
        description: `Item identified as ${identified.name}`,
      });
      
      return identified;
    } catch (error) {
      console.error('Error identifying waste:', error);
      toast({
        title: 'Identification Failed',
        description: 'Could not identify the waste item. Please try again.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsIdentifying(false);
    }
  };
  
  const searchWasteItems = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    const results = wasteTypes.filter(waste => 
      waste.name.toLowerCase().includes(query.toLowerCase()) ||
      waste.description.toLowerCase().includes(query.toLowerCase()) ||
      waste.category.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(results);
  };
  
  const recordWasteDisposal = (waste: WasteType, quantity: number = 1) => {
    // Add waste to user's record
    addWaste(waste.id, quantity);
    
    // Check if this puts the user over their limit
    if (isOverLimit(waste.category)) {
      toast({
        title: 'Disposal Limit Exceeded',
        description: `You've exceeded your daily limit for ${waste.category} waste!`,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Waste Recorded',
        description: `${quantity} ${waste.name} added to your disposal log`,
      });
    }
    
    return {
      success: true,
      isOverLimit: isOverLimit(waste.category),
      currentCount: getTodayWasteCount(waste.category)
    };
  };
  
  const getCategoryStats = () => {
    return categories.map(category => ({
      ...category,
      count: getTodayWasteCount(category.id),
      isOverLimit: isOverLimit(category.id)
    }));
  };
  
  return {
    identifyWaste,
    isIdentifying,
    identifiedWaste,
    searchWasteItems,
    searchResults,
    searchQuery,
    recordWasteDisposal,
    getCategoryStats,
    updateDisposalLimit
  };
};
