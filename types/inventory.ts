interface FormBase {
  name: string;
  company: string;
  packingSize: string;
  purchasePrice: string;
  quantity: string;
  sellingPrice: string;
  totalCost: string;
  estimatedprofit: string;
  manufacturingDate: Date;
  expiryDate: Date;
  date: Date;
}

export interface SeedsInitialFormData extends FormBase {
  season: string;
  crop: string;
  variety: string;
  batchNumber: string;
  pricePerUnit: string;
  totalWeight: string;
}

export interface FertilizersInitialFormData extends FormBase {
  type: string;
  state: string;
}

export interface PesticidesInitialFormData extends FormBase {
  type: string;
  batchNumber: string;
  state: string;
}
