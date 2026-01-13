export interface CartItem {
  acquired: string;
  alias: string;
  categoryId: number;
  created: string;
  createdBy: number;
  description: number;
  endDate: string;
  hasCertificate: boolean;
  hash: string;
  id: number;
  image: string;
  isFree: boolean;
  isSpecial: boolean;
  isStepByStep: boolean;
  modified: string;
  modifiedBy: number;
  ordering: number;
  params: any;
  passAverageScore: number;
  passMinScore: number;
  price: number;
  prices: {
    final: PriceObject;
    origin: PriceObject;
  };
  specialPrice: number;
  startDate: string;
  state: {
    name: string;
    value: number;
  };
  teacherId: number;
  title: string;
  totals: {
    final_total: PriceObject;
    total: PriceObject;
  }
}

export interface PriceObject {
  label: string;
  name: string;
  params: any;
  price: number;
}

