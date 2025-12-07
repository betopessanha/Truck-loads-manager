
export interface Load {
  id: string;
  currentLocation: string;
  pickupLocation: string;
  deliveryLocation: string;
  emptyMiles: number;
  loadedMiles: number;
  totalMiles: number;
  timestamp: Date;
  pickupDate: Date;
  deliveryDate: Date;
}