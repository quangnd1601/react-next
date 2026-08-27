export interface ISportCenter {
  _id?: string;
  owner_id?: {
    _id: string;
    name: string;
    email?: string;
    phone?: string;
  } | string;
  sport_id?: {
    _id: string;
    name: string;
  } | string;
  name: string;
  address: string;
  default_price?: number;
  opening_time?: string;
  closing_time?: string;
  thumbnail?: string;
  images?: string[];
  description?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  total_views?: number;
  total_bookings?: number;
  average_rating?: number;
  total_reviews?: number;
  created_at?: string;
}

export interface ISport {
  _id: string;
  name: string;
  description?: string;
}
