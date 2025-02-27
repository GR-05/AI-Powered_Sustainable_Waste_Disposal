
export interface WasteType {
  id: string;
  name: string;
  category: 'organic' | 'plastic' | 'glass' | 'metal' | 'paper' | 'electronic' | 'hazardous' | 'other';
  decompositionTime: {
    min: number;
    max: number;
    unit: 'days' | 'weeks' | 'months' | 'years';
  };
  description: string;
  applicableRs: ('refuse' | 'reduce' | 'reuse' | 'repurpose' | 'recycle')[];
  reuseSuggestions: string[];
  recyclingNotes?: string;
  hazardousNotes?: string;
  imageUrl?: string;
}

export const wasteTypes: WasteType[] = [
  {
    id: 'banana-peel',
    name: 'Banana Peel',
    category: 'organic',
    decompositionTime: {
      min: 2,
      max: 5,
      unit: 'weeks'
    },
    description: 'Banana peels are organic waste that decompose relatively quickly.',
    applicableRs: ['reduce', 'reuse', 'recycle'],
    reuseSuggestions: [
      'Compost it to create nutrient-rich soil',
      'Use as plant fertilizer by burying near plants',
      'Polish leather shoes or silverware',
      'Use to reduce itching from bug bites'
    ],
    recyclingNotes: 'Excellent for composting',
    imageUrl: 'https://images.unsplash.com/photo-1572453800999-e8d2d1589b7c?q=80&w=200'
  },
  {
    id: 'plastic-bottle',
    name: 'Plastic Bottle',
    category: 'plastic',
    decompositionTime: {
      min: 450,
      max: 1000,
      unit: 'years'
    },
    description: 'Single-use plastic bottles are a significant environmental concern due to their extremely long decomposition time.',
    applicableRs: ['refuse', 'reduce', 'reuse', 'repurpose', 'recycle'],
    reuseSuggestions: [
      'Reuse as a water bottle',
      'Create a planter for small plants',
      'Make a bird feeder',
      'Use as storage for small items',
      'Create DIY crafts and decorations'
    ],
    recyclingNotes: 'Remove cap and label before recycling; check local guidelines',
    imageUrl: 'https://images.unsplash.com/photo-1572964734607-0051976fac79?q=80&w=200'
  },
  {
    id: 'glass-bottle',
    name: 'Glass Bottle',
    category: 'glass',
    decompositionTime: {
      min: 1,
      max: 2,
      unit: 'years'
    },
    description: 'Glass bottles can be recycled indefinitely without loss in quality or purity.',
    applicableRs: ['reduce', 'reuse', 'repurpose', 'recycle'],
    reuseSuggestions: [
      'Reuse as a water or beverage container',
      'Create a decorative vase',
      'Make a lamp base',
      'Use as a candle holder',
      'Create a terrarium'
    ],
    recyclingNotes: 'Rinse before recycling; remove caps or corks',
    imageUrl: 'https://images.unsplash.com/photo-1563699182-9df869e75d24?q=80&w=200'
  },
  {
    id: 'newspaper',
    name: 'Newspaper',
    category: 'paper',
    decompositionTime: {
      min: 2,
      max: 6,
      unit: 'weeks'
    },
    description: 'Newspapers are biodegradable and can be easily recycled.',
    applicableRs: ['reduce', 'reuse', 'repurpose', 'recycle'],
    reuseSuggestions: [
      'Use as packaging material',
      'Create paper mache crafts',
      'Use as mulch in gardens',
      'Clean windows and mirrors',
      'Make fire starters'
    ],
    recyclingNotes: 'Easily recyclable; keep dry and clean',
    imageUrl: 'https://images.unsplash.com/photo-1566378246598-5b11a0d486cc?q=80&w=200'
  },
  {
    id: 'aluminum-can',
    name: 'Aluminum Can',
    category: 'metal',
    decompositionTime: {
      min: 80,
      max: 200,
      unit: 'years'
    },
    description: 'Aluminum cans are 100% recyclable and can be recycled indefinitely.',
    applicableRs: ['reduce', 'reuse', 'repurpose', 'recycle'],
    reuseSuggestions: [
      'Create pen holders',
      'Make a DIY phone speaker',
      'Use as seed starters',
      'Create lanterns or candle holders',
      'Make wind chimes'
    ],
    recyclingNotes: 'Rinse before recycling; high value in recycling programs',
    imageUrl: 'https://images.unsplash.com/photo-1576398289164-c94fbdce9b73?q=80&w=200'
  },
  {
    id: 'old-smartphone',
    name: 'Old Smartphone',
    category: 'electronic',
    decompositionTime: {
      min: 500,
      max: 1000,
      unit: 'years'
    },
    description: 'Electronic waste contains valuable materials but also hazardous components.',
    applicableRs: ['reduce', 'reuse', 'repurpose', 'recycle'],
    reuseSuggestions: [
      'Repurpose as a media player',
      'Use as a dedicated GPS device',
      'Create a home security camera',
      'Donate to charities',
      'Sell or trade-in for newer models'
    ],
    recyclingNotes: 'Take to e-waste collection centers; contains valuable metals',
    hazardousNotes: 'Contains batteries and other toxic materials',
    imageUrl: 'https://images.unsplash.com/photo-1585394732583-3fb4cd191fe5?q=80&w=200'
  },
  {
    id: 'batteries',
    name: 'Batteries',
    category: 'hazardous',
    decompositionTime: {
      min: 100,
      max: 500,
      unit: 'years'
    },
    description: 'Batteries contain toxic chemicals and heavy metals that can pollute soil and waterways.',
    applicableRs: ['reduce', 'reuse', 'recycle'],
    reuseSuggestions: [
      'Use rechargeable batteries instead',
      'Return to manufacturer recycling programs',
      'Take to designated collection points'
    ],
    recyclingNotes: 'Never dispose with regular trash; special recycling required',
    hazardousNotes: 'Contains corrosive materials and heavy metals',
    imageUrl: 'https://images.unsplash.com/photo-1528901589426-6ac2ef3767b8?q=80&w=200'
  },
  {
    id: 'fabric-scraps',
    name: 'Fabric Scraps',
    category: 'other',
    decompositionTime: {
      min: 1,
      max: 5,
      unit: 'years'
    },
    description: 'Fabric scraps can vary in composition from natural fibers to synthetics.',
    applicableRs: ['reduce', 'reuse', 'repurpose', 'recycle'],
    reuseSuggestions: [
      'Create patchwork items',
      'Use as cleaning rags',
      'Make handkerchiefs',
      'Create pillow stuffing',
      'Make face masks or hair accessories'
    ],
    recyclingNotes: 'Natural fibers can be composted; some textiles can be recycled',
    imageUrl: 'https://images.unsplash.com/photo-1549989317-6f14743af1bf?q=80&w=200'
  }
];

export const categories = [
  { id: 'organic', name: 'Organic', description: 'Food waste, plant material, and biodegradable items' },
  { id: 'plastic', name: 'Plastic', description: 'Various plastic items that may take hundreds of years to decompose' },
  { id: 'glass', name: 'Glass', description: 'Glass containers and items that are highly recyclable' },
  { id: 'metal', name: 'Metal', description: 'Metal items that can often be recycled indefinitely' },
  { id: 'paper', name: 'Paper', description: 'Paper products that are generally easy to recycle' },
  { id: 'electronic', name: 'Electronic', description: 'E-waste containing both valuable and hazardous materials' },
  { id: 'hazardous', name: 'Hazardous', description: 'Items containing toxic chemicals requiring special disposal' },
  { id: 'other', name: 'Other', description: 'Miscellaneous waste items that don\'t fit other categories' }
];

export const defaultDisposalLimits = {
  'organic': 5,
  'plastic': 3,
  'glass': 2,
  'metal': 2,
  'paper': 5,
  'electronic': 1,
  'hazardous': 1,
  'other': 3
};

export type VendorType = {
  id: string;
  name: string;
  description: string;
  acceptedCategories: string[];
  pricing?: Record<string, { min: number; max: number; unit: string }>;
  location: string;
  contact: string;
  website?: string;
};

export const vendors: VendorType[] = [
  {
    id: 'green-recyclers',
    name: 'Green Recyclers',
    description: 'Full-service recycling company specializing in paper, plastic, and metal waste.',
    acceptedCategories: ['plastic', 'metal', 'paper'],
    pricing: {
      'plastic': { min: 0.05, max: 0.15, unit: '$/kg' },
      'metal': { min: 0.20, max: 0.50, unit: '$/kg' },
      'paper': { min: 0.02, max: 0.10, unit: '$/kg' }
    },
    location: 'Downtown Area',
    contact: 'contact@greenrecyclers.example.com'
  },
  {
    id: 'tech-recovery',
    name: 'Tech Recovery Solutions',
    description: 'Specializing in electronic waste recovery and data destruction services.',
    acceptedCategories: ['electronic'],
    pricing: {
      'electronic': { min: 1.00, max: 10.00, unit: '$/item' }
    },
    location: 'Industrial District',
    contact: 'info@techrecovery.example.com',
    website: 'https://techrecovery.example.com'
  },
  {
    id: 'compost-kings',
    name: 'Compost Kings',
    description: 'Organic waste collection service that turns food waste into premium compost.',
    acceptedCategories: ['organic'],
    pricing: {
      'organic': { min: 0.00, max: 0.05, unit: '$/kg' }
    },
    location: 'City Outskirts',
    contact: 'hello@compostkings.example.com'
  },
  {
    id: 'safe-disposal',
    name: 'Safe Disposal Inc.',
    description: 'Licensed hazardous waste disposal company with state-of-the-art facilities.',
    acceptedCategories: ['hazardous'],
    location: 'Industrial Zone',
    contact: 'disposal@safedisposal.example.com'
  },
  {
    id: 'glass-works',
    name: 'Glass Works Recycling',
    description: 'Specialized in glass recycling and repurposing for art and construction.',
    acceptedCategories: ['glass'],
    pricing: {
      'glass': { min: 0.03, max: 0.12, unit: '$/kg' }
    },
    location: 'Arts District',
    contact: 'recycle@glassworks.example.com',
    website: 'https://glassworks-recycling.example.com'
  }
];
