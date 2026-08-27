import { ISportCenter, ISport } from "@/interface/sportCenter";
import { API_BASE_URL } from "@/config/env";

export interface ICourtDetail {
  _id: string;
  sport_center_id: string;
  court_name: string;
  price: number;
  peak_price?: number;
  thumbnail?: string;
  status: string;
}

export interface ITimeSlot {
  _id: string;
  start_time: string;
  end_time: string;
  is_peak_hour: boolean;
}

export interface IBookedSlot {
  _id: string;
  court_id: string;
  time_slot_id: string;
  booking_for_date: string;
  status: string;
}

export interface IHomeCategory {
  _id: string;
  name: string;
  description?: string;
}

export interface IHomeVoucher {
  _id: string;
  code: string;
  discount_type: "PERCENTAGE" | "FIXED";
  discount_value: number;
  min_order_value: number;
  max_discount_amount?: number;
  end_date?: string;
}

export interface IHomeData {
  popularCenters: ISportCenter[];
  mostViewedCenters: ISportCenter[];
  categories: IHomeCategory[];
  vouchers: IHomeVoucher[];
}

export const clientCourtService = {
  // 1. Lấy dữ liệu Trang chủ (cụm sân phổ biến, xem nhiều, môn thể thao, voucher)
  async getHomeData(popularLimit = 4, mostViewedLimit = 4): Promise<IHomeData> {
    const res = await fetch(`${API_BASE_URL}/home?popularLimit=${popularLimit}&mostViewedLimit=${mostViewedLimit}`);
    const data = await res.json();
    return data.success
      ? data.data
      : { popularCenters: [], mostViewedCenters: [], categories: [], vouchers: [] };
  },

  // 2. Lấy danh sách Cụm Sân có bộ lọc (cho trang Tìm Sân Client)
  async getCentersList(filters?: {
    search?: string;
    sport_id?: string;
    min_price?: number | string;
    max_price?: number | string;
    sort?: string;
  }): Promise<ISportCenter[]> {
    const query = new URLSearchParams();
    if (filters?.search) query.append("search", filters.search);
    if (filters?.sport_id) query.append("sport_id", filters.sport_id);
    if (filters?.min_price) query.append("min_price", String(filters.min_price));
    if (filters?.max_price) query.append("max_price", String(filters.max_price));
    if (filters?.sort) query.append("sort", filters.sort);

    const res = await fetch(`${API_BASE_URL}/sport-centers?${query.toString()}`);
    const data = await res.json();
    return data.success ? data.data : [];
  },

  // 3. Lấy danh sách các môn thể thao
  async getSports(): Promise<ISport[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/sports`);
      const data = await res.json();
      return data.success ? data.data : data.sports || [];
    } catch {
      return [];
    }
  },

  // 4. Lấy chi tiết Cụm Sân theo ID
  async getCenterDetail(centerId: string): Promise<ISportCenter | null> {
    const res = await fetch(`${API_BASE_URL}/sport-centers/${centerId}`);
    const data = await res.json();
    return data.success ? data.data : null;
  },

  // 3. Lấy danh sách các Sân Chi Tiết thuộc Cụm Sân
  async getCourtsByCenter(centerId: string): Promise<ICourtDetail[]> {
    const res = await fetch(`${API_BASE_URL}/courts/sport-centers/${centerId}`);
    const data = await res.json();
    return data.success ? data.data : [];
  },

  // 4. Lấy tất cả Khung Giờ (TimeSlots)
  async getAllTimeSlots(): Promise<ITimeSlot[]> {
    const res = await fetch(`${API_BASE_URL}/timeslots`);
    const data = await res.json();
    return data.success ? data.data : [];
  },

  // 5. Lấy danh sách các Khung Giờ ĐÃ ĐẶT (BookedSlots) để kiểm tra trùng lịch
  async getBookedSlots(date: string, courtIds: string[] = []): Promise<IBookedSlot[]> {
    const courtIdsQuery = courtIds.join(",");
    const res = await fetch(`${API_BASE_URL}/timeslots/booked-slots?date=${date}&court_ids=${courtIdsQuery}`);
    const data = await res.json();
    return data.success ? data.data : [];
  }
};
