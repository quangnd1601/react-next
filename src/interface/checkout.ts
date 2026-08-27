export interface ICheckoutState {
    paymentMethod: string;
    note?: string;
    voucherCode?: string;
    discount: number;
    subtotal: number;
    isSubmitting: boolean;
    error: string | null;
    successMessage: string | null;
}

export type CheckoutAction =
    | { type: 'SET_PAYMENT_METHOD'; payload: string }
    | { type: 'SET_NOTE'; payload: string }
    | { type: 'SET_VOUCHER_CODE'; payload: string }
    | { type: 'APPLY_VOUCHER'; payload: number }
    | { type: 'SET_SUBTOTAL'; payload: number }
    | { type: 'SUBMIT_START' }
    | { type: 'SUBMIT_SUCCESS'; payload: string }
    | { type: 'SUBMIT_ERROR'; payload: string };

export interface IBookingDetail {
    court_id: string;
    time_slot_id: string;
    price_at_booking: number;
}

export interface IBookingService {
    service_id: string;
    quantity: number;
    price_at_booking: number;
}

export interface IBookingData {
    user_id: string;
    booking_for_date: string;
    total_price: number;
    details: IBookingDetail[];
    services?: IBookingService[];
    note?: string;
    payment_method: string;
    voucher_code?: string;
}
