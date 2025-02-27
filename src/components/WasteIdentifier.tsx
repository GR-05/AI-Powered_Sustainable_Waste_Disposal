
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useWasteManagement } from '@/hooks/useWasteManagement';
import { Input } from '@/components/ui/input';
import { Loader2, Upload, Search, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const WasteIdentifier: React.FC = () => {
  const { identifyWaste, isIdentifying, searchWasteItems, searchResults, searchQuery } = useWasteManagement();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please select an image under 5MB',
          variant: 'destructive',
        });
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please select an image file',
          variant: 'destructive',
        });
        return;
      }
      
      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIdentifyClick = async () => {
    if (!selectedFile) {
      toast({
        title: 'No image selected',
        description: 'Please upload an image to identify',
        variant: 'destructive',
      });
      return;
    }
    
    await identifyWaste(selectedFile);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center">
              <div 
                className={cn(
                  "w-full aspect-video rounded-md border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden relative",
                  previewUrl ? "border-primary" : "border-muted-foreground/25 hover:border-muted-foreground/50"
                )}
                onClick={triggerFileInput}
              >
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center">
                    <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-1">Drag and drop an image or click to browse</p>
                    <p className="text-xs text-muted-foreground">Supports JPG, PNG, WEBP (max 5MB)</p>
                  </div>
                )}
              </div>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              
              <div className="flex gap-3 mt-4 w-full">
                <Button
                  variant="outline"
                  onClick={triggerFileInput}
                  className="flex-1"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Select Image
                </Button>
                <Button 
                  className="flex-1"
                  disabled={!selectedFile || isIdentifying}
                  onClick={handleIdentifyClick}
                >
                  {isIdentifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Camera className="mr-2 h-4 w-4" />
                      Identify Waste
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="mb-4">
              <label htmlFor="search" className="text-sm font-medium mb-1 block">
                Search by description or type
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="E.g. plastic bottle, organic waste..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => searchWasteItems(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {searchResults.length > 0 ? (
                searchResults.map((waste) => (
                  <div 
                    key={waste.id} 
                    className="p-3 border rounded-md hover:bg-accent transition-colors cursor-pointer flex items-center gap-3"
                    onClick={() => {
                      // Set identified waste directly from search
                      useWasteManagement().setIdentifiedWaste(waste);
                    }}
                  >
                    {waste.imageUrl && (
                      <img 
                        src={waste.imageUrl} 
                        alt={waste.name}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    )}
                    <div>
                      <p className="font-medium">{waste.name}</p>
                      <p className="text-xs text-muted-foreground">{waste.category}</p>
                    </div>
                  </div>
                ))
              ) : searchQuery ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No waste items found matching "{searchQuery}"
                </p>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">
                    Type above to search for waste items
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WasteIdentifier;

// Helper function for conditional classnames
function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
