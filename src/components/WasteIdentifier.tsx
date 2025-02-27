
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useWasteManagement } from '@/hooks/useWasteManagement';
import { useWaste } from '@/context/WasteContext';
import { Input } from '@/components/ui/input';
import { Loader2, Upload, Search, Camera, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const WasteIdentifier: React.FC = () => {
  const { identifyWaste, isIdentifying, searchWasteItems, searchResults, searchQuery } = useWasteManagement();
  const { setIdentifiedWaste } = useWaste();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
        description: 'Please upload an image or capture one with your camera to identify',
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

  const startCamera = async () => {
    try {
      setIsCapturing(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      toast({
        title: 'Camera active',
        description: 'Position the waste item in frame and tap "Capture"',
      });
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast({
        title: 'Camera access denied',
        description: 'Please allow camera access or upload an image instead',
        variant: 'destructive',
      });
      setIsCapturing(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    setIsCapturing(false);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the current video frame to the canvas
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to blob
        canvas.toBlob((blob) => {
          if (blob) {
            // Create a File object from the blob
            const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
            setSelectedFile(file);
            
            // Generate preview URL
            const imageUrl = URL.createObjectURL(blob);
            setPreviewUrl(imageUrl);
            
            // Stop the camera
            stopCamera();
            
            toast({
              title: 'Image captured',
              description: 'Click "Identify Waste" to analyze the image',
            });
          }
        }, 'image/jpeg', 0.95);
      }
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
                  previewUrl || isCapturing ? "border-primary" : "border-muted-foreground/25 hover:border-muted-foreground/50"
                )}
                onClick={isCapturing ? undefined : triggerFileInput}
              >
                {isCapturing ? (
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="w-full h-full object-cover"
                  />
                ) : previewUrl ? (
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
              
              {/* Hidden elements */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <canvas ref={canvasRef} className="hidden" />
              
              <div className="flex gap-3 mt-4 w-full">
                {isCapturing ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={stopCamera}
                      className="flex-1"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                    <Button 
                      className="flex-1"
                      onClick={captureImage}
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Capture
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={previewUrl ? () => {
                        setPreviewUrl(null);
                        setSelectedFile(null);
                      } : triggerFileInput}
                      className="flex-1"
                    >
                      {previewUrl ? (
                        <>
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Clear
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload
                        </>
                      )}
                    </Button>
                    <Button 
                      variant={previewUrl ? "default" : "outline"}
                      className="flex-1"
                      onClick={previewUrl ? handleIdentifyClick : startCamera}
                      disabled={isIdentifying}
                    >
                      {isIdentifying ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : previewUrl ? (
                        <>
                          <Search className="mr-2 h-4 w-4" />
                          Identify Waste
                        </>
                      ) : (
                        <>
                          <Camera className="mr-2 h-4 w-4" />
                          Use Camera
                        </>
                      )}
                    </Button>
                  </>
                )}
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
                      setIdentifiedWaste(waste);
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
