import { API_BASE_URL } from "@/config/env";
import { authedFetch } from "@/services/client/session";

export interface IVoucher {
    _id: string;
    code: string;
    discount_type: "PERCENTAGE" | "FIXED";
    discount_value: number;
    min_order_value: number;
    max_discount_amount?: number;
    start_date: string;
    end_date: string;
    usage_limit?: number;
    used_count: number;
    status: string;
    created_at?: string;
}

export const adminVoucherService = {
    async getAll(): Promise<IVoucher[]> {
        const res = await fetch(`${API_BASE_URL}/vouchers`);
        const data = await res.json();
        return data.success ? data.data : [];
    },
    async getById(id: string): Promise<IVoucher | null> {
        const res = await fetch(`${API_BASE_URL}/vouchers/${id}`);
        const data = await res.json();
        return data.success ? data.data : null;
    },
    async create(payload: Partial<IVoucher>): Promise<{ success: boolean; data?: IVoucher; message?: string }> {
        const res = await authedFetch(`${API_BASE_URL}/vouchers`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        return res.json();
    },
    async update(id: string, payload: Partial<IVoucher>): Promise<{ success: boolean; data?: IVoucher; message?: string }> {
        const res = await authedFetch(`${API_BASE_URL}/vouchers/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        return res.json();
    },
    async delete(id: string): Promise<{ success: boolean; message?: string }> {
        const res = await authedFetch(`${API_BASE_URL}/vouchers/${id}`, {
            method: "DELETE",
        });
        return res.json();
    },
};