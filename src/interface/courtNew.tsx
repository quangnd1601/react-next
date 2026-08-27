export interface ICourtNew {
    _id?: string;
    name: string;
    category_id?: string;
    sport_id?: { _id: string; name: string } | string;
    thumbnail: string;
    booking_count?: number;
    total_bookings?: number;
    total_views?: number;
    rating_avg?: number;
    average_rating?: number;
    address: string;
    min_price?: number;
    default_price?: number;
    is_new?: boolean;
}