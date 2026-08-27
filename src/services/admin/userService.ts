import { IUser } from "@/interface/auth";
import { API_BASE_URL } from "@/config/env";
import { authedFetch } from "@/services/client/session";

export const adminUserService = {
    async getAll(): Promise<IUser[]> {
        const res = await authedFetch(`${API_BASE_URL}/users`);
        const data = await res.json();
        return data.users || [];
    },
    async lock(id: string): Promise<{ success: boolean; message?: string }> {
        const res = await authedFetch(`${API_BASE_URL}/users/${id}/lock`, {
            method: "PUT",
        });
        const data = await res.json();
        return { success: res.ok, ...data };
    },
    async unlock(id: string): Promise<{ success: boolean; message?: string }> {
        const res = await authedFetch(`${API_BASE_URL}/users/${id}/unlock`, {
            method: "PUT",
        });
        const data = await res.json();
        return { success: res.ok, ...data };
    },
};