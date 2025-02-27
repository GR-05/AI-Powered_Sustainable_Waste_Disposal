
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import TabNavigation, { TabPanel } from '@/components/ui/TabNavigation';
import { WasteProvider } from '@/context/WasteContext';
import WasteIdentifier from '@/components/WasteIdentifier';
import DecompositionInfo from '@/components/DecompositionInfo';
import ReuseSuggestions from '@/components/ReuseSuggestions';
import DisposalTracker from '@/components/DisposalTracker';
import VendorMarketplace from '@/components/VendorMarketplace';
import WasteDetail from '@/components/WasteDetail';
import { Camera, Clock, Recycle, BarChart, Store } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('identify');
  const [showDetail, setShowDetail] = useState(false);

  const tabs = [
    { id: 'identify', label: 'Identify', icon: <Camera className="h-4 w-4" /> },
    { id: 'decomposition', label: 'Decomposition', icon: <Clock className="h-4 w-4" /> },
    { id: 'reuse', label: '5R Suggestions', icon: <Recycle className="h-4 w-4" /> },
    { id: 'disposal', label: 'Disposal Tracker', icon: <BarChart className="h-4 w-4" /> },
    { id: 'marketplace', label: 'Marketplace', icon: <Store className="h-4 w-4" /> },
  ];

  return (
    <WasteProvider>
      <div className="min-h-screen flex flex-col">
        <header className="border-b bg-white dark:bg-transparent">
          <div className="container py-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Recycle className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold tracking-tight">WasteWise Genius</h1>
            </div>
            
            <div className="hidden md:flex md:items-center md:gap-4">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'default' : 'ghost'}
                  className="flex items-center gap-2"
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </header>
        
        <main className="flex-1 container py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              AI-Powered Waste Management
            </h2>
            <p className="text-muted-foreground max-w-3xl">
              Identify waste, learn about decomposition times, get reuse suggestions, 
              track disposal limits, and connect with interested vendors.
            </p>
          </div>
          
          <div className="md:hidden mb-8">
            <TabNavigation
              tabs={tabs}
              defaultValue={activeTab}
              onChange={setActiveTab}
            >
              {/* Empty TabsContent elements to register tabs */}
              {tabs.map((tab) => (
                <TabPanel key={tab.id} value={tab.id} className="hidden"></TabPanel>
              ))}
            </TabNavigation>
          </div>
          
          {showDetail ? (
            <WasteDetail onClose={() => setShowDetail(false)} />
          ) : (
            <div className="space-y-8">
              {activeTab === 'identify' && <WasteIdentifier />}
              {activeTab === 'decomposition' && <DecompositionInfo />}
              {activeTab === 'reuse' && <ReuseSuggestions />}
              {activeTab === 'disposal' && <DisposalTracker />}
              {activeTab === 'marketplace' && <VendorMarketplace />}
            </div>
          )}
        </main>
        
        <footer className="border-t py-6 mt-auto">
          <div className="container text-center text-sm text-muted-foreground">
            <p>WasteWise Genius — AI-Powered Waste Management</p>
          </div>
        </footer>
      </div>
    </WasteProvider>
  );
};

export default Index;
