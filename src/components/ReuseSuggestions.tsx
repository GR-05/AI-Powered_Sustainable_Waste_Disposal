
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWaste } from '@/context/WasteContext';
import { Recycle, RefreshCw, Ban, ArrowDown, Undo } from 'lucide-react';

const ReuseSuggestions: React.FC = () => {
  const { identifiedWaste } = useWaste();

  if (!identifiedWaste) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>5R Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Please identify a waste item first to see reuse suggestions.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Define the 5Rs with their icons and descriptions
  const fiveRs = [
    {
      name: 'Refuse',
      icon: <Ban className="h-5 w-5" />,
      description: 'Avoid creating waste by not accepting or purchasing items that generate waste',
      applicable: identifiedWaste.applicableRs.includes('refuse')
    },
    {
      name: 'Reduce',
      icon: <ArrowDown className="h-5 w-5" />,
      description: 'Minimize waste by using less of the product or finding alternatives',
      applicable: identifiedWaste.applicableRs.includes('reduce')
    },
    {
      name: 'Reuse',
      icon: <RefreshCw className="h-5 w-5" />,
      description: 'Use items again for the same or different purposes',
      applicable: identifiedWaste.applicableRs.includes('reuse')
    },
    {
      name: 'Repurpose',
      icon: <Undo className="h-5 w-5" />,
      description: 'Transform an item to serve a different function',
      applicable: identifiedWaste.applicableRs.includes('repurpose')
    },
    {
      name: 'Recycle',
      icon: <Recycle className="h-5 w-5" />,
      description: 'Process items into new products or materials',
      applicable: identifiedWaste.applicableRs.includes('recycle')
    }
  ];

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>5R Suggestions</span>
          <Badge className="ml-2" variant="outline">
            {identifiedWaste.applicableRs.length} applicable R{identifiedWaste.applicableRs.length !== 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {fiveRs.map((r) => (
            <div 
              key={r.name}
              className={`rounded-lg p-4 flex items-start gap-3 ${
                r.applicable 
                  ? 'bg-nature-100 dark:bg-nature-900/30 text-nature-800 dark:text-nature-300 border border-nature-200 dark:border-nature-800' 
                  : 'bg-muted/50 text-muted-foreground border border-muted'
              }`}
            >
              <div className={`rounded-full p-2 ${
                r.applicable 
                  ? 'bg-nature-200 dark:bg-nature-800 text-nature-800 dark:text-nature-300' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {r.icon}
              </div>
              <div>
                <h3 className="font-medium mb-1">{r.name}</h3>
                <p className="text-xs">{r.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <h3 className="text-lg font-semibold mb-3">Reuse & Repurpose Ideas</h3>
        
        {identifiedWaste.reuseSuggestions && identifiedWaste.reuseSuggestions.length > 0 ? (
          <ul className="space-y-2">
            {identifiedWaste.reuseSuggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="bg-nature-100 dark:bg-nature-900/30 text-nature-800 dark:text-nature-300 rounded-full min-w-6 h-6 flex items-center justify-center text-sm">
                  {index + 1}
                </div>
                <span className="pt-0.5">{suggestion}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">No specific reuse suggestions available for this item.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ReuseSuggestions;
