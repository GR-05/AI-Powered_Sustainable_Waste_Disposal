
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWaste } from '@/context/WasteContext';
import { Clock, AlertTriangle } from 'lucide-react';

const DecompositionInfo: React.FC = () => {
  const { identifiedWaste } = useWaste();

  if (!identifiedWaste) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>Decomposition Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Please identify a waste item first to see decomposition information.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { decompositionTime } = identifiedWaste;
  
  // Get human-readable time ranges
  const getTimeDisplay = () => {
    const { min, max, unit } = decompositionTime;
    
    if (min === max) {
      return `${min} ${unit}`;
    }
    
    return `${min} to ${max} ${unit}`;
  };
  
  // Determine environmental impact level
  const getImpactLevel = () => {
    const { unit, max } = decompositionTime;
    
    if (unit === 'days' || unit === 'weeks' || (unit === 'months' && max < 6)) {
      return { level: 'Low', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' };
    } else if (unit === 'months' || (unit === 'years' && max < 10)) {
      return { level: 'Medium', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' };
    } else if (unit === 'years' && max < 100) {
      return { level: 'High', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' };
    } else {
      return { level: 'Severe', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' };
    }
  };
  
  const impact = getImpactLevel();

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Decomposition Information</span>
          <Badge className="ml-2" variant="outline">
            {identifiedWaste.category}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
          {identifiedWaste.imageUrl && (
            <img 
              src={identifiedWaste.imageUrl} 
              alt={identifiedWaste.name} 
              className="w-24 h-24 object-cover rounded-md" 
            />
          )}
          <div>
            <h3 className="text-xl font-semibold mb-1">{identifiedWaste.name}</h3>
            <p className="text-muted-foreground text-sm mb-2">{identifiedWaste.description}</p>
            
            <div className="flex items-center mt-3">
              <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
              <span className="font-medium">Decomposition Time:</span>
              <span className="ml-2">{getTimeDisplay()}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-accent/50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className={`h-5 w-5 mt-0.5 ${impact.level === 'Low' ? 'text-green-600' : impact.level === 'Medium' ? 'text-yellow-600' : impact.level === 'High' ? 'text-orange-600' : 'text-red-600'}`} />
            <div>
              <h4 className="font-medium mb-1">Environmental Impact</h4>
              <p className="text-sm text-muted-foreground mb-2">
                This waste has a {impact.level.toLowerCase()} environmental impact based on decomposition time.
              </p>
              <Badge className={impact.color}>
                {impact.level} Impact
              </Badge>
            </div>
          </div>
        </div>
        
        {identifiedWaste.hazardousNotes && (
          <div className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-lg p-4">
            <h4 className="font-medium mb-1">Hazardous Warning</h4>
            <p className="text-sm">{identifiedWaste.hazardousNotes}</p>
          </div>
        )}
        
        {identifiedWaste.recyclingNotes && (
          <div className="bg-nature-100 dark:bg-nature-900/20 text-nature-800 dark:text-nature-300 rounded-lg p-4">
            <h4 className="font-medium mb-1">Recycling Notes</h4>
            <p className="text-sm">{identifiedWaste.recyclingNotes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DecompositionInfo;
