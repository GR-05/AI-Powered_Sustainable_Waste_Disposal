
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { vendors, VendorType } from '@/lib/wasteData';
import { useWaste } from '@/context/WasteContext';
import { Mail, ExternalLink, Phone, MapPin, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const VendorMarketplace: React.FC = () => {
  const { identifiedWaste } = useWaste();
  const { toast } = useToast();
  const [contactForm, setContactForm] = useState({
    vendorId: '',
    name: '',
    email: '',
    message: ''
  });
  const [showContactForm, setShowContactForm] = useState(false);

  // Filter vendors to show ones that accept the identified waste type
  const relevantVendors = identifiedWaste 
    ? vendors.filter(vendor => vendor.acceptedCategories.includes(identifiedWaste.category))
    : vendors;

  const handleContactClick = (vendorId: string) => {
    setContactForm({
      ...contactForm,
      vendorId,
      message: identifiedWaste 
        ? `I have ${identifiedWaste.name} waste that I'd like to sell/deposit.` 
        : 'I have waste that I\'d like to sell/deposit.'
    });
    setShowContactForm(true);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, we would send this data to a backend
    console.log('Contact form submitted:', contactForm);
    
    toast({
      title: 'Message Sent',
      description: 'Your message has been sent to the vendor. They will contact you soon.',
    });
    
    setShowContactForm(false);
    setContactForm({
      vendorId: '',
      name: '',
      email: '',
      message: ''
    });
  };

  const selectedVendor = vendors.find(v => v.id === contactForm.vendorId);

  return (
    <div className="space-y-6 animate-fade-in">
      {identifiedWaste && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Sell or Deposit Your Waste</CardTitle>
            <CardDescription>
              Find vendors interested in your {identifiedWaste.name} waste
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 mb-4">
              {identifiedWaste.imageUrl && (
                <img 
                  src={identifiedWaste.imageUrl} 
                  alt={identifiedWaste.name} 
                  className="w-12 h-12 object-cover rounded-md" 
                />
              )}
              <div>
                <h3 className="font-medium">{identifiedWaste.name}</h3>
                <p className="text-sm text-muted-foreground">Category: {identifiedWaste.category}</p>
              </div>
            </div>
            
            {relevantVendors.length > 0 ? (
              <p className="text-sm">
                We found {relevantVendors.length} vendor{relevantVendors.length !== 1 ? 's' : ''} that may be interested in your waste.
              </p>
            ) : (
              <div className="bg-muted p-4 rounded-md text-center">
                <p className="text-sm text-muted-foreground">
                  No vendors currently accept this type of waste. Consider the 5R options instead.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      {showContactForm ? (
        <Card>
          <CardHeader>
            <CardTitle>Contact Vendor</CardTitle>
            <CardDescription>
              Send a message to {selectedVendor?.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Your Name
                </label>
                <Input
                  id="name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Your Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <Textarea
                  id="message"
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  rows={4}
                  required
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowContactForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Send Message
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {relevantVendors.map((vendor) => (
            <VendorCard 
              key={vendor.id} 
              vendor={vendor} 
              onContactClick={handleContactClick} 
              isRelevant={identifiedWaste ? vendor.acceptedCategories.includes(identifiedWaste.category) : true}
              identifiedWasteCategory={identifiedWaste?.category}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface VendorCardProps {
  vendor: VendorType;
  onContactClick: (vendorId: string) => void;
  isRelevant: boolean;
  identifiedWasteCategory?: string;
}

const VendorCard: React.FC<VendorCardProps> = ({ 
  vendor, 
  onContactClick, 
  isRelevant,
  identifiedWasteCategory
}) => {
  return (
    <Card className={`overflow-hidden h-full transition-all duration-300 ${isRelevant ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{vendor.name}</CardTitle>
          {isRelevant && identifiedWasteCategory && (
            <Badge className="bg-primary text-primary-foreground">
              Accepts {identifiedWasteCategory}
            </Badge>
          )}
        </div>
        <CardDescription className="mt-1">{vendor.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Accepted Waste Categories</h4>
          <div className="flex flex-wrap gap-2">
            {vendor.acceptedCategories.map((category) => (
              <Badge 
                key={category} 
                variant="outline"
                className={identifiedWasteCategory === category ? 'bg-primary/10' : ''}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
        
        {vendor.pricing && Object.keys(vendor.pricing).length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Pricing Information</h4>
            <div className="space-y-1">
              {Object.entries(vendor.pricing).map(([category, { min, max, unit }]) => (
                <div key={category} className="flex items-center text-sm">
                  <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="capitalize">{category}:</span>
                  <span className="ml-1">
                    {min === max ? `${min} ${unit}` : `${min} - ${max} ${unit}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="pt-2">
          <div className="flex items-center text-sm mb-1">
            <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>{vendor.location}</span>
          </div>
          <div className="flex items-center text-sm">
            <Mail className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>{vendor.contact}</span>
          </div>
          {vendor.website && (
            <a 
              href={vendor.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-sm mt-1 text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              <span>Visit Website</span>
            </a>
          )}
        </div>
        
        <Button
          className="w-full mt-2"
          onClick={() => onContactClick(vendor.id)}
        >
          Contact Vendor
        </Button>
      </CardContent>
    </Card>
  );
};

export default VendorMarketplace;
