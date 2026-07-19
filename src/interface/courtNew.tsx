export interface ICourtNew {
    id: string;
    name: string;
    category_id: string;
    thumbnail: string;
    booking_count: number;
    rating_avg: number;
    address: string;
    min_price: number;
    is_new?: boolean;
}