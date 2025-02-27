
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWaste } from '@/context/WasteContext';
import { X, Info, Clock, Recycle } from 'lucide-react';
import DecompositionInfo from './DecompositionInfo';
import ReuseSuggestions from './ReuseSuggestions';

interface WasteDetailProps {
  onClose: () => void;
}

const WasteDetail: React.FC<WasteDetailProps> = ({ onClose }) => {
  const { identifiedWaste } = useWaste();

  if (!identifiedWaste) {
    return null;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto overflow-hidden animate-fade-in">
      <CardHeader className="relative border-b">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        <div className="flex items-start gap-4">
          {identifiedWaste.imageUrl && (
            <img
              src={identifiedWaste.imageUrl}
              alt={identifiedWaste.name}
              className="w-20 h-20 object-cover rounded-md"
            />
          )}
          <div>
            <CardTitle className="text-2xl">{identifiedWaste.name}</CardTitle>
            <div className="flex items-center gap-2 mt-1 mb-2">
              <Badge>{identifiedWaste.category}</Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {identifiedWaste.decompositionTime.min === identifiedWaste.decompositionTime.max
                  ? `${identifiedWaste.decompositionTime.min} ${identifiedWaste.decompositionTime.unit}`
                  : `${identifiedWaste.decompositionTime.min}-${identifiedWaste.decompositionTime.max} ${identifiedWaste.decompositionTime.unit}`}
              </Badge>
            </div>
            <CardDescription>{identifiedWaste.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="decomposition" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b">
            <TabsTrigger value="decomposition" className="flex items-center gap-1">
              <Info className="h-4 w-4" />
              <span>Decomposition</span>
            </TabsTrigger>
            <TabsTrigger value="reuse" className="flex items-center gap-1">
              <Recycle className="h-4 w-4" />
              <span>5R Suggestions</span>
            </TabsTrigger>
          </TabsList>
          <div className="p-6">
            <TabsContent value="decomposition" className="mt-0">
              <DecompositionInfo />
            </TabsContent>
            <TabsContent value="reuse" className="mt-0">
              <ReuseSuggestions />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WasteDetail;
