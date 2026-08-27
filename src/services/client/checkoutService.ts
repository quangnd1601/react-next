import { IBookingData } from "@/interface/checkout";
import { API_BASE_URL } from "@/config/env";
import { authedFetch } from "@/services/client/session";

export const clientCheckoutService = {
    // Tạo đơn đặt sân (tự xử lý refresh / hết phiên qua authedFetch)
    async createBooking(bookingData: IBookingData, _token?: string) {
        const response = await authedFetch(`${API_BASE_URL}/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || data.error || 'Có lỗi xảy ra khi thanh toán.');
        }
        return data;
    },

    // Tạo link thanh toán payOS sau khi đã tạo booking thành công
    async createPaymentLink(bookingId: string, _token?: string) {
        const response = await authedFetch(`${API_BASE_URL}/payments/create-link`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ booking_id: bookingId })
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || data.error || 'Có lỗi xảy ra khi tạo link thanh toán.');
        }
        return data;
    },

    // Kiểm tra trạng thái thanh toán payOS theo orderCode
    async getPaymentStatus(orderCode: string, _token?: string) {
        const response = await authedFetch(`${API_BASE_URL}/payments/status/${orderCode}`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || data.error || 'Có lỗi xảy ra khi kiểm tra trạng thái thanh toán.');
        }
        return data;
    }
};
