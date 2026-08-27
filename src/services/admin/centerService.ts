import { ISportCenter, ISport } from "@/interface/sportCenter";
import { API_BASE_URL } from "@/config/env";

export const adminCenterService = {
  // 1. Lấy danh sách cụm sân (cho Admin có tìm kiếm/lọc)
  async getAll(params?: { search?: string; sport_id?: string; status?: string }): Promise<ISportCenter[]> {
    const query = new URLSearchParams();
    if (params?.search) query.append("search", params.search);
    if (params?.sport_id && params.sport_id !== "all") query.append("sport_id", params.sport_id);
    if (params?.status) query.append("status", params.status);

    const res = await fetch(`${API_BASE_URL}/sport-centers?${query.toString()}`);
    const data = await res.json();
    return data.success ? data.data : [];
  },

  // 2. Lấy chi tiết 1 cụm sân
  async getById(id: string): Promise<ISportCenter | null> {
    const res = await fetch(`${API_BASE_URL}/sport-centers/${id}`);
    const data = await res.json();
    return data.success ? data.data : null;
  },

  // 3. Thêm mới cụm sân
  async create(payload: Partial<ISportCenter>): Promise<{ success: boolean; data?: ISportCenter; message?: string }> {
    const res = await fetch(`${API_BASE_URL}/sport-centers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data;
  },

  // 4. Cập nhật cụm sân
  async update(id: string, payload: Partial<ISportCenter>): Promise<{ success: boolean; data?: ISportCenter; message?: string }> {
    const res = await fetch(`${API_BASE_URL}/sport-centers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data;
  },

  // 5. Xóa cụm sân
  async delete(id: string): Promise<{ success: boolean; message?: string }> {
    const res = await fetch(`${API_BASE_URL}/sport-centers/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    return data;
  },

  // 6. Lấy danh sách Môn thể thao (Sports)
  async getSports(): Promise<ISport[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/sports`);
      const data = await res.json();
      return data.success ? data.data : data.sports || [];
    } catch {
      return [];
    }
  }
};