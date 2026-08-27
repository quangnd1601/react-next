export interface ICourt {
    _id: string;
    name: string;
    sport_type: "Tennis" | "Cầu lông" | "Pickleball";
    thumbnail: string;
    booking_count: number;
    rating_avg: number;
    address: string;
    min_price: number;
    is_new?: boolean;
}