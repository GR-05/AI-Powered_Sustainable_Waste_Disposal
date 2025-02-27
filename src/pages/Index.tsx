
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
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-nature-50/50 to-earth-50/50 dark:from-nature-950/50 dark:to-earth-950/50">
        <header className="border-b bg-white/90 dark:bg-nature-950/90 backdrop-blur-md sticky top-0 z-10 shadow-sm">
          <div className="container py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Recycle className="h-7 w-7 text-primary" />
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-nature-700 to-nature-500 dark:from-nature-300 dark:to-nature-500 bg-clip-text text-transparent">WasteWise Genius</h1>
            </div>
            
            <div className="hidden md:flex md:items-center md:gap-3">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'default' : 'ghost'}
                  className={`flex items-center gap-2 rounded-full ${activeTab === tab.id ? 'shadow-md' : ''}`}
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
          <div className="mb-8 text-center md:text-left max-w-3xl mx-auto md:mx-0">
            <h2 className="text-3xl font-bold tracking-tight mb-2 bg-gradient-to-r from-nature-800 to-nature-600 dark:from-nature-300 dark:to-nature-500 bg-clip-text text-transparent">
              AI-Powered Waste Management
            </h2>
            <p className="text-muted-foreground">
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
                <TabPanel key={tab.id} value={tab.id} className="hidden">
                  <div></div>
                </TabPanel>
              ))}
            </TabNavigation>
          </div>
          
          {showDetail ? (
            <WasteDetail onClose={() => setShowDetail(false)} />
          ) : (
            <div className="space-y-8 animate-fade-in">
              {activeTab === 'identify' && <WasteIdentifier />}
              {activeTab === 'decomposition' && <DecompositionInfo />}
              {activeTab === 'reuse' && <ReuseSuggestions />}
              {activeTab === 'disposal' && <DisposalTracker />}
              {activeTab === 'marketplace' && <VendorMarketplace />}
            </div>
          )}
        </main>
        
        <footer className="border-t py-6 mt-auto bg-white/70 dark:bg-black/20 backdrop-blur-sm">
          <div className="container text-center text-sm text-muted-foreground">
            <p>WasteWise Genius — AI-Powered Waste Management</p>
            <p className="text-xs mt-1 opacity-70">Helping you make sustainable choices for a cleaner planet</p>
          </div>
        </footer>
      </div>
    </WasteProvider>
  );
};

export default Index;
