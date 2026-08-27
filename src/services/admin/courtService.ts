
import { API_BASE_URL } from "@/config/env";

export interface ICourtAdmin {
    _id: string;
    sport_center_id: {
        _id: string;
        name: string;
        address: string;
        status: string;
        sport_id?: {
            _id: string;
            name: string;
        };
    } | string;
    court_name: string;
    price: number;
    peak_price?: number;
    thumbnail?: string;
    status: string; // ACTIVE | MAINTENANCE | INACTIVE
    total_bookings?: number;
    created_at?: string;
}

export const adminCourtService = {
    // 1. Lấy tất cả sân (admin)
    async getAll(): Promise<ICourtAdmin[]> {
        const res = await fetch(`${API_BASE_URL}/courts`);
        const data = await res.json();
        return data.success ? data.data : [];
    },

    // 2. Lấy sân theo cụm sân (admin xem tất cả kể cả bảo trì/tạm đóng)
    async getByCenter(centerId: string): Promise<ICourtAdmin[]> {
        const res = await fetch(`${API_BASE_URL}/courts/sport-centers/${centerId}?includeInactive=true`);
        const data = await res.json();
        return data.success ? data.data : [];
    },

    // 3. Lấy chi tiết 1 sân
    async getById(id: string): Promise<ICourtAdmin | null> {
        const res = await fetch(`${API_BASE_URL}/courts/${id}`);
        const data = await res.json();
        return data.success ? data.data : null;
    },

    // 4. Tạo sân mới
    async create(payload: Partial<ICourtAdmin>): Promise<{ success: boolean; data?: ICourtAdmin; message?: string }> {
        const res = await fetch(`${API_BASE_URL}/courts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        return data;
    },

    // 5. Cập nhật sân
    async update(id: string, payload: Partial<ICourtAdmin>): Promise<{ success: boolean; data?: ICourtAdmin; message?: string }> {
        const res = await fetch(`${API_BASE_URL}/courts/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        return data;
    },

    // 6. Xóa sân
    async delete(id: string): Promise<{ success: boolean; message?: string }> {
        const res = await fetch(`${API_BASE_URL}/courts/${id}`, {
            method: "DELETE",
        });
        const data = await res.json();
        return data;
    }
};