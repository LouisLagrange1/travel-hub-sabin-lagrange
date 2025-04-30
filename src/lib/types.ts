export interface Offer {
  _id: string;
  from: string;
  to: string;
  departDate: string;
  returnDate: string;
  provider: string;
  price: number;
  currency: string;
  legs?: Array<{
    flightNum: string;
    dep: string;
    arr: string;
    duration: string;
  }>;
  hotel?: {
    name: string;
    nights: number;
    price: number;
  };
  activity?: {
    title: string;
    price: number;
  };
  relatedOffers?: string[];
  createdAt?: string;
}
