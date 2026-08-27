export interface ITimeSlot {
    _id: string;
    start_time: string;
    end_time: string;
    is_peak_hour: boolean;
}

export interface ISportCenterInfo {
    _id: string;
    name: string;
    address: string;
    sport_id?: {
        _id: string;
        name: string;
    };
}

export interface ICourtInfo {
    _id: string;
    court_name: string;
    price: number;
    peak_price?: number;
    sport_center_id?: ISportCenterInfo;
}

export interface IBookingDetail {
    court_id: ICourtInfo;
    time_slot_id: ITimeSlot;
    price_at_booking: number;
}

export interface IBookingService {
    service_id: {
        _id: string;
        service_name: string;
        price: number;
    };
    quantity: number;
    price_at_booking: number;
}

export interface IBooking {
    _id: string;
    booking_for_date: string; // 'YYYY-MM-DD'
    subtotal: number;
    total_price: number;
    payment_method: string;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
    note?: string;
    details: IBookingDetail[];
    services?: IBookingService[];
    created_at: string;
}