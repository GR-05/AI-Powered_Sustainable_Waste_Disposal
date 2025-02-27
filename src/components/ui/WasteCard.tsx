
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface WasteCardProps {
  title: string;
  description?: string;
  imageUrl?: string;
  category?: string;
  footer?: React.ReactNode;
  badges?: string[];
  className?: string;
  onClick?: () => void;
  isSelected?: boolean;
}

const WasteCard: React.FC<WasteCardProps> = ({
  title,
  description,
  imageUrl,
  category,
  footer,
  badges = [],
  className,
  onClick,
  isSelected = false
}) => {
  return (
    <Card 
      className={cn(
        'overflow-hidden transition-all duration-300 h-full',
        isSelected ? 'ring-2 ring-primary' : 'hover:shadow-md',
        onClick ? 'cursor-pointer' : '',
        className
      )}
      onClick={onClick}
    >
      {imageUrl && (
        <div className="relative w-full h-40 overflow-hidden bg-muted">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
          {category && (
            <Badge className="absolute top-2 right-2 bg-white/80 text-foreground dark:bg-black/50">
              {category}
            </Badge>
          )}
        </div>
      )}
      <CardHeader className="p-4">
        <CardTitle className="text-lg font-medium leading-tight">{title}</CardTitle>
        {description && (
          <CardDescription className="text-sm mt-1">{description}</CardDescription>
        )}
      </CardHeader>
      {badges && badges.length > 0 && (
        <CardContent className="p-4 pt-0">
          <div className="flex flex-wrap gap-2">
            {badges.map((badge, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {badge}
              </Badge>
            ))}
          </div>
        </CardContent>
      )}
      {footer && (
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
};

export default WasteCard;
