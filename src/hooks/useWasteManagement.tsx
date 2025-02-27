
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

  // Simulated AI identification with image analysis
  const identifyWaste = async (imageFile: File | null) => {
    setIsIdentifying(true);
    
    try {
      // In a real app, we would send the image to an AI service
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (!imageFile) {
        throw new Error('No image provided');
      }
      
      // Create a FileReader to extract image data
      const reader = new FileReader();
      
      // Wrap FileReader in a Promise
      const imageData = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });
      
      // Simulate simple image analysis based on filename and size
      // In a real app, this would be done by ML/AI image recognition
      const fileName = imageFile.name.toLowerCase();
      const fileSize = imageFile.size;
      
      // Try to match by filename keywords first
      let matchedWaste: WasteType | null = null;
      
      const keywordMap: Record<string, string[]> = {
        'plastic': ['plastic', 'bottle', 'container', 'packaging'],
        'paper': ['paper', 'newspaper', 'cardboard', 'document'],
        'organic': ['food', 'banana', 'apple', 'vegetable', 'fruit', 'peel'],
        'glass': ['glass', 'bottle', 'jar'],
        'metal': ['can', 'aluminum', 'tin', 'metal'],
        'electronic': ['phone', 'battery', 'electronic', 'device', 'charger', 'computer'],
        'hazardous': ['chemical', 'battery', 'oil', 'paint']
      };
      
      // Try to identify by filename
      for (const category in keywordMap) {
        for (const keyword of keywordMap[category as keyof typeof keywordMap]) {
          if (fileName.includes(keyword)) {
            // Find a waste type in this category
            const matchingWastes = wasteTypes.filter(waste => waste.category === category);
            if (matchingWastes.length > 0) {
              // Pick one matching waste type
              matchedWaste = matchingWastes[Math.floor(Math.random() * matchingWastes.length)];
              break;
            }
          }
        }
        if (matchedWaste) break;
      }
      
      // If no match by filename, use a more sophisticated approach
      // In this simulation, we'll use file size as another "feature"
      if (!matchedWaste) {
        // Arbitrary rules for simulation purposes
        if (fileSize < 200000) { // Small files (< 200KB)
          // More likely to be simple items like organic waste or paper
          const simpleTypes = wasteTypes.filter(waste => 
            ['organic', 'paper'].includes(waste.category)
          );
          matchedWaste = simpleTypes[Math.floor(Math.random() * simpleTypes.length)];
        } else if (fileSize < 1000000) { // Medium files (200KB - 1MB)
          // Could be plastic, glass, or metal
          const mediumTypes = wasteTypes.filter(waste => 
            ['plastic', 'glass', 'metal'].includes(waste.category)
          );
          matchedWaste = mediumTypes[Math.floor(Math.random() * mediumTypes.length)];
        } else { // Large files (> 1MB)
          // More likely to be complex items like electronics
          const complexTypes = wasteTypes.filter(waste => 
            ['electronic', 'hazardous', 'other'].includes(waste.category)
          );
          matchedWaste = complexTypes[Math.floor(Math.random() * complexTypes.length)];
        }
      }
      
      // If we still couldn't identify it, fallback to random selection
      if (!matchedWaste) {
        const randomIndex = Math.floor(Math.random() * wasteTypes.length);
        matchedWaste = wasteTypes[randomIndex];
      }
      
      console.log(`Identified waste: ${matchedWaste.name} (${matchedWaste.category})`);
      console.log(`Identification method: ${matchedWaste ? 'AI analysis' : 'Random fallback'}`);
      
      setIdentifiedWaste(matchedWaste);
      
      toast({
        title: 'Waste Identified',
        description: `Item identified as ${matchedWaste.name} (${matchedWaste.category})`,
      });
      
      return matchedWaste;
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
    setIdentifiedWaste,
    searchWasteItems,
    searchResults,
    searchQuery,
    recordWasteDisposal,
    getCategoryStats,
    updateDisposalLimit,
    isOverLimit
  };
};
