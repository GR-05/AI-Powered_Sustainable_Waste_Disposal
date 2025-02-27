
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWaste } from '@/context/WasteContext';
import { useWasteManagement } from '@/hooks/useWasteManagement';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Plus, Minus } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { defaultDisposalLimits, categories, WasteType } from '@/lib/wasteData';

const DisposalTracker: React.FC = () => {
  const { identifiedWaste, userWaste, getTodayWasteCount, addWaste } = useWaste();
  const { updateDisposalLimit, isOverLimit } = useWasteManagement();
  const [quantity, setQuantity] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingLimit, setEditingLimit] = useState(false);
  const [newLimit, setNewLimit] = useState<number | null>(null);

  const handleAddWaste = () => {
    if (identifiedWaste) {
      addWaste(identifiedWaste.id, quantity);
      setQuantity(1);
    }
  };

  const handleUpdateLimit = () => {
    if (selectedCategory && newLimit !== null) {
      updateDisposalLimit(selectedCategory, newLimit);
      setEditingLimit(false);
      setNewLimit(null);
    }
  };

  const startEditingLimit = (category: string) => {
    setSelectedCategory(category);
    setNewLimit(userWaste.disposalLimits[category] || defaultDisposalLimits[category as keyof typeof defaultDisposalLimits] || 0);
    setEditingLimit(true);
  };

  const categoryStats = categories.map(category => ({
    ...category,
    count: getTodayWasteCount(category.id),
    limit: userWaste.disposalLimits[category.id] || defaultDisposalLimits[category.id as keyof typeof defaultDisposalLimits] || 0,
    isOverLimit: isOverLimit(category.id)
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      {identifiedWaste && (
        <Card>
          <CardHeader>
            <CardTitle>Record Waste Disposal</CardTitle>
            <CardDescription>
              Add {identifiedWaste.name} to your disposal tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start mb-4">
              {identifiedWaste.imageUrl && (
                <img 
                  src={identifiedWaste.imageUrl} 
                  alt={identifiedWaste.name} 
                  className="w-20 h-20 object-cover rounded-md" 
                />
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{identifiedWaste.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">Category: {identifiedWaste.category}</p>
                
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">Quantity:</span>
                  <div className="flex items-center">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8" 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="mx-3 min-w-8 text-center">{quantity}</span>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8" 
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <Button 
                onClick={handleAddWaste}
                className="sm:self-end"
              >
                Record Disposal
              </Button>
            </div>
            
            {isOverLimit(identifiedWaste.category) && (
              <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Warning: You've exceeded your daily limit for {identifiedWaste.category} waste!
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Disposal Limits & Tracking</CardTitle>
          <CardDescription>
            Monitor your daily waste disposal and set limits per category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {categoryStats.map((category) => (
              <div key={category.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{category.name}</h3>
                    <p className="text-xs text-muted-foreground">{category.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-semibold ${category.isOverLimit ? 'text-destructive' : ''}`}>
                        {category.count}
                      </span>
                      <span className="text-sm text-muted-foreground">/ {category.limit}</span>
                    </div>
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="h-auto p-0 text-xs"
                      onClick={() => startEditingLimit(category.id)}
                    >
                      Edit Limit
                    </Button>
                  </div>
                </div>
                
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      category.isOverLimit 
                        ? 'bg-destructive' 
                        : category.count / category.limit > 0.7 
                          ? 'bg-orange-500' 
                          : 'bg-primary'
                    }`}
                    style={{ width: `${Math.min(100, (category.count / category.limit) * 100)}%` }}
                  />
                </div>
                
                {category.isOverLimit && (
                  <p className="text-xs text-destructive mt-1">
                    Limit exceeded by {category.count - category.limit} items
                  </p>
                )}
              </div>
            ))}
          </div>
          
          {editingLimit && selectedCategory && (
            <div className="mt-6 p-4 border rounded-lg">
              <h3 className="font-medium mb-3">
                Update {categories.find(c => c.id === selectedCategory)?.name} Limit
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm">Limit:</span>
                  <div className="flex-1">
                    <Slider
                      value={newLimit !== null ? [newLimit] : [0]}
                      min={1}
                      max={20}
                      step={1}
                      onValueChange={(value) => setNewLimit(value[0])}
                    />
                  </div>
                  <span className="font-medium min-w-8 text-center">{newLimit}</span>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setEditingLimit(false);
                      setNewLimit(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateLimit}>
                    Save Limit
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DisposalTracker;
