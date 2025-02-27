
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabNavigationProps {
  tabs: Tab[];
  defaultValue: string;
  onChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  defaultValue,
  onChange,
  children,
  className
}) => {
  return (
    <Tabs 
      defaultValue={defaultValue} 
      className={cn('w-full', className)}
      onValueChange={onChange}
    >
      <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 w-full mb-8">
        {tabs.map((tab) => (
          <TabsTrigger 
            key={tab.id} 
            value={tab.id}
            className="flex items-center justify-center gap-2 py-3"
          >
            {tab.icon}
            <span>{tab.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
      {children}
    </Tabs>
  );
};

export default TabNavigation;

export const TabPanel: React.FC<{
  value: string;
  children: React.ReactNode;
  className?: string;
}> = ({ value, children, className }) => {
  return (
    <TabsContent 
      value={value} 
      className={cn('focus-visible:outline-none focus-visible:ring-0 animate-fade-in', className)}
    >
      {children}
    </TabsContent>
  );
};
