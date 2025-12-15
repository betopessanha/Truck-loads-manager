export interface Load {
  id: number;
  currentLocation: string;
  pickupLocation: string;
  deliveryLocation: string;
  emptyMiles: number;
  loadedMiles: number;
  totalMiles: number;
  timestamp: Date;
  pickupDate: Date;
  deliveryDate: Date;
  reference?: string;
  rate?: number;
  type?: string;
  status?: 'Pending' | 'In Transit' | 'Delivered' | 'Invoiced' | 'Paid';
  brokerName?: string;
  fuelCost?: number;
}