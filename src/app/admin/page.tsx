"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import "./page.css";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend,
    AreaChart, Area
} from "recharts";
import { adminCenterService } from "@/services/admin/centerService";
import { adminCourtService } from "@/services/admin/courtService";
import { ISportCenter } from "@/interface/sportCenter";
import { API_BASE_URL } from "@/config/env";
import { authedFetch } from "@/services/client/session";

const fmtMoney = (n: number) => n.toLocaleString("vi-VN") + "đ";

interface IBookingForDash {
    _id: string;
    total_price: number;
    status: string;
    booking_for_date?: string;
    created_at?: string;
    user_id?: {
        _id: string;
        name: string;
        phone?: string;
    };
    details?: Array<{
        court_id?: {
            court_name?: string;
            sport_center_id?: {
                _id?: string;
                name?: string;
            };
        };
        time_slot_id?: {
            start_time?: string;
            end_time?: string;
        };
    }>;
}

/* Custom Tooltip for revenue chart */
interface IRevenueTooltipProps {
    active?: boolean;
    payload?: Array<{ value: number }>;
    label?: string;
}

const RevenueTooltip = ({ active, payload, label }: IRevenueTooltipProps) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "10px 14px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
                <p style={{ margin: 0, fontWeight: 700, color: "#00236f", fontSize: 13 }}>{label}</p>
                <p style={{ margin: "4px 0 0", color: "#16a34a", fontWeight: 600, fontSize: 14 }}>{fmtMoney(payload[0].value)}</p>
            </div>
        );
    }
    return null;
};

const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};

export default function AdminPage() {
    // Dữ liệu thật
    const [centers, setCenters] = useState<ISportCenter[]>([]);
    const [courtsCount, setCourtsCount] = useState(0);
    const [bookings, setBookings] = useState<IBookingForDash[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [centerSportFilter, setCenterSportFilter] = useState("all");

    const loadDashboard = useCallback(async () => {
        setLoading(true);
        try {
            const [centerList, courtList] = await Promise.all([
                adminCenterService.getAll(),
                adminCourtService.getAll(),
            ]);
            setCenters(centerList);
            setCourtsCount(courtList.length);

            const res = await authedFetch(`${API_BASE_URL}/bookings`);
            const data = await res.json();
            if (data.success) setBookings(data.data || []);
        } catch (err) {
            console.error("Lỗi tải dữ liệu dashboard:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        Promise.resolve().then(() => loadDashboard());
    }, [loadDashboard]);

    // Auto-refresh khi quay lại trang admin (focus)
    useEffect(() => {
        const onFocus = () => loadDashboard();
        window.addEventListener("focus", onFocus);
        return () => window.removeEventListener("focus", onFocus);
    }, [loadDashboard]);

    /* ── Tính toán số liệu thật ── */
    // Doanh thu: CHỈ tính các đơn ĐÃ XÁC NHẬN (CONFIRMED) hoặc HOÀN THÀNH (COMPLETED)
    const paidBookings = bookings.filter(b => b.status === "CONFIRMED" || b.status === "COMPLETED");
    const totalRevenue = paidBookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
    const totalBookings = bookings.length;
    const totalCenters = centers.length;

    // Booking status
    const pendingCount = bookings.filter((b) => b.status === "PENDING").length;
    const confirmedCount = bookings.filter((b) => b.status === "CONFIRMED").length;
    const completedCount = bookings.filter((b) => b.status === "COMPLETED").length;
    const cancelledCount = bookings.filter((b) => b.status === "CANCELLED").length;

    // Doanh thu theo tháng (chỉ tính đơn đã xác nhận/hoàn thành)
    const revenueData = [
        { month: "T1", revenue: 0 },
        { month: "T2", revenue: 0 },
        { month: "T3", revenue: 0 },
        { month: "T4", revenue: 0 },
        { month: "T5", revenue: 0 },
        { month: "T6", revenue: 0 },
        { month: "T7", revenue: 0 },
    ];
    paidBookings.forEach((b) => {
        const date = b.created_at ? new Date(b.created_at) : null;
        const idx = date ? date.getMonth() : 0; // 0-11
        if (idx >= 0 && idx < 7) {
            revenueData[idx].revenue += b.total_price || 0;
        } else if (idx >= 7) {
            revenueData[6].revenue += b.total_price || 0; // gộp về T7
        }
    });
    // Doanh thu theo tháng: luôn dùng dữ liệu thật từ bookings, không fallback hardcode

    // Xu hướng booking 7 ngày
    const bookingTrendData = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const dayStr = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
        const count = bookings.filter((b) => {
            if (!b.created_at) return false;
            const bd = new Date(b.created_at);
            return bd.toDateString() === d.toDateString();
        }).length;
        return { day: dayStr, bookings: count };
    });

    // Phân bổ bộ môn
    const sportMap = new Map<string, number>();
    centers.forEach((c) => {
        const sportName = typeof c.sport_id === "object" ? c.sport_id?.name : "Khác";
        sportMap.set(sportName, (sportMap.get(sportName) || 0) + 1);
    });
    const sportPalette = ["#2563eb", "#16a34a", "#d97706", "#dc2626", "#7c3aed", "#0288d1"];
    const sportDistribution = Array.from(sportMap.entries()).map(([name, value], i) => ({
        name,
        value,
        color: sportPalette[i % sportPalette.length],
    }));
    // (Phân bố môn thể thao: luôn dùng dữ liệu thật từ cụm sân, không fallback hardcode)

    // Doanh thu THẬT theo từng cụm sân (từ các đơn đã xác nhận/hoàn thành)
    const revenueByCenter = new Map<string, { bookings: number; revenue: number }>();
    paidBookings.forEach((b) => {
        const centerId = b.details?.[0]?.court_id?.sport_center_id?._id;
        if (!centerId) return;
        const entry = revenueByCenter.get(centerId) || { bookings: 0, revenue: 0 };
        entry.bookings += 1;
        entry.revenue += b.total_price || 0;
        revenueByCenter.set(centerId, entry);
    });

    // Top cụm sân: sắp theo doanh thu thật, fallback total_bookings
    const topCenters = [...centers]
        .map((c) => {
            const centerId = c._id || "";
            const stats = revenueByCenter.get(centerId);
            return {
                name: c.name,
                sport: typeof c.sport_id === "object" ? c.sport_id?.name || "N/A" : "N/A",
                bookings: stats ? stats.bookings : c.total_bookings || 0,
                revenue: stats ? stats.revenue : (c.total_bookings || 0) * (c.default_price || 0),
            };
        })
        .sort((a, b) => b.revenue - a.revenue) // Sắp theo doanh thu thật giảm dần
        .slice(0, 5);
    const hasRealTop = topCenters.length > 0;

    // Các cụm sân mới
    const newCenters = [...centers]
        .sort((a, b) => {
            const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
            const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
            return bTime - aTime;
        })
        .slice(0, 5);

    const filteredTopCenters = topCenters.filter((c) => centerSportFilter === "all" || c.sport === centerSportFilter);

    // Recent bookings sắp theo mới nhất
    const recentBookings = [...bookings]
        .sort((a, b) => (b.created_at ? new Date(b.created_at).getTime() : 0) - (a.created_at ? new Date(a.created_at).getTime() : 0))
        .slice(0, 5);

    return (
        <>
            <header className="admin-topbar">
                <h1 className="admin-topbar-title">Tổng quan hệ thống</h1>
                <div className="admin-topbar-right">
                    <span className="admin-topbar-role">{localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") || "{}").name || "Admin" : "Admin"}</span>
                    <div className="admin-topbar-avatar">A</div>
                </div>
            </header>

            <div className="admin-page-body">
                {loading ? (
                    <div style={{ textAlign: "center", padding: "48px", color: "#00236f" }}>Đang tải dữ liệu tổng quan...</div>
                ) : (
                    <>
                        {/* ── KPI Stat cards ── */}
                        <div className="stat-grid">
                            <div className="stat-card">
                                <div className="stat-icon green"><span className="material-symbols-outlined">payments</span></div>
                                <div>
                                    <span className="stat-label">Doanh thu</span>
                                    <p className="stat-value">{fmtMoney(totalRevenue)}</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon blue"><span className="material-symbols-outlined">event_note</span></div>
                                <div>
                                    <span className="stat-label">Tổng booking</span>
                                    <p className="stat-value">{totalBookings}</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon purple"><span className="material-symbols-outlined">stadium</span></div>
                                <div>
                                    <span className="stat-label">Tổng Cụm sân</span>
                                    <p className="stat-value">{totalCenters}</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon orange"><span className="material-symbols-outlined">sports_tennis</span></div>
                                <div>
                                    <span className="stat-label">Tổng số sân</span>
                                    <p className="stat-value">{courtsCount}</p>
                                </div>
                            </div>
                        </div>

                        {/* ── Booking status mini ── */}
                        <div className="booking-status-row">
                            <div className="booking-status-box pending">
                                <span className="booking-status-num">{pendingCount}</span>
                                <span className="booking-status-lbl">Chờ duyệt</span>
                            </div>
                            <div className="booking-status-box confirmed">
                                <span className="booking-status-num">{confirmedCount}</span>
                                <span className="booking-status-lbl">Đã xác nhận</span>
                            </div>
                            <div className="booking-status-box completed">
                                <span className="booking-status-num">{completedCount}</span>
                                <span className="booking-status-lbl">Hoàn thành</span>
                            </div>
                            <div className="booking-status-box cancelled">
                                <span className="booking-status-num">{cancelledCount}</span>
                                <span className="booking-status-lbl">Đã hủy</span>
                            </div>
                        </div>

                        {/* ── CHARTS ROW ── */}
                        <div className="dashboard-charts-row">
                            <div className="chart-card" style={{ flex: 2 }}>
                                <h3 className="table-card-title" style={{ marginBottom: 20 }}>
                                    <span className="material-symbols-outlined" style={{ verticalAlign: "middle", marginRight: 8, color: "#16a34a" }}>trending_up</span>
                                    Doanh thu theo tháng (2026)
                                </h3>
                                <ResponsiveContainer width="100%" height={280}>
                                    <BarChart data={revenueData} barCategoryGap="25%">
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={{ stroke: "#e5e7eb" }} />
                                        <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={{ stroke: "#e5e7eb" }} tickFormatter={(v) => (v / 1000000) + "tr"} />
                                        <Tooltip content={<RevenueTooltip />} />
                                        <Bar dataKey="revenue" fill="#00236f" radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="chart-card" style={{ flex: 1 }}>
                                <h3 className="table-card-title" style={{ marginBottom: 20 }}>
                                    <span className="material-symbols-outlined" style={{ verticalAlign: "middle", marginRight: 8, color: "#7c3aed" }}>pie_chart</span>
                                    Phân bổ bộ môn
                                </h3>
                                <ResponsiveContainer width="100%" height={280}>
                                    <PieChart>
                                        <Pie
                                            data={sportDistribution}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={55}
                                            outerRadius={90}
                                            paddingAngle={4}
                                            dataKey="value"
                                            label={({ name, percent }: { name?: string; percent?: number }) => `${name || ""} ${((percent || 0) * 100).toFixed(0)}%`}
                                            labelLine={false}
                                        >
                                            {sportDistribution.map((entry, idx) => (
                                                <Cell key={idx} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* ── Biểu đồ xu hướng booking 7 ngày ── */}
                        <div className="chart-card" style={{ marginBottom: 32 }}>
                            <h3 className="table-card-title" style={{ marginBottom: 20 }}>
                                <span className="material-symbols-outlined" style={{ verticalAlign: "middle", marginRight: 8, color: "#2563eb" }}>timeline</span>
                                Xu hướng Booking 7 ngày gần nhất
                            </h3>
                            <ResponsiveContainer width="100%" height={220}>
                                <AreaChart data={bookingTrendData}>
                                    <defs>
                                        <linearGradient id="bookingGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={{ stroke: "#e5e7eb" }} />
                                    <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={{ stroke: "#e5e7eb" }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                                        labelStyle={{ fontWeight: 700, color: "#00236f" }}
                                    />
                                    <Area type="monotone" dataKey="bookings" stroke="#2563eb" strokeWidth={2.5} fill="url(#bookingGradient)" dot={{ r: 4, fill: "#2563eb" }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        {/* ── TOP CỤM SÂN & CỤM SÂN MỚI ── */}
                        <div className="dashboard-charts-row">
                            {/* Top cụm sân */}
                            <div className="chart-card" style={{ flex: 1 }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
                                    <h3 className="table-card-title" style={{ margin: 0 }}>
                                        <span className="material-symbols-outlined" style={{ verticalAlign: "middle", marginRight: 8, color: "#ea580c" }}>emoji_events</span>
                                        Top Cụm sân đặt nhiều nhất
                                    </h3>
                                    <div style={{ display: "flex", gap: 8 }}>
                                        <select className="select-filter-field" value={centerSportFilter} onChange={e => setCenterSportFilter(e.target.value)} style={{ height: 36, fontSize: 12, padding: "0 10px", minWidth: 120 }}>
                                            <option value="all">Tất cả bộ môn</option>
                                            {Array.from(sportMap.keys()).map((s) => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="table-scroll">
                                    <table className="owner-table">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Tên cụm sân</th>
                                                <th>Bộ môn</th>
                                                <th>Lượt đặt</th>
                                                <th>Doanh thu</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {hasRealTop && filteredTopCenters.length > 0 ? filteredTopCenters.map((c, idx) => (
                                                <tr key={c.name}>
                                                    <td>
                                                        <span style={{
                                                            display: "inline-flex", alignItems: "center", justifyContent: "center",
                                                            width: 28, height: 28, borderRadius: "50%", fontWeight: 700, fontSize: 12,
                                                            background: idx < 3 ? "#fffbeb" : "#f3f4f6",
                                                            color: idx < 3 ? "#d97706" : "#6b7280",
                                                            border: idx < 3 ? "1px solid #fcd34d" : "1px solid #e5e7eb"
                                                        }}>
                                                            {idx + 1}
                                                        </span>
                                                    </td>
                                                    <td><strong>{c.name}</strong></td>
                                                    <td><span className="badge badge-sport">{c.sport}</span></td>
                                                    <td><strong style={{ color: "#00236f" }}>{c.bookings}</strong></td>
                                                    <td><strong style={{ color: "#16a34a" }}>{fmtMoney(c.revenue)}</strong></td>
                                                </tr>
                                            )) : (
                                                <tr><td colSpan={5} style={{ textAlign: "center", padding: 20, color: "#6b7280" }}>Chưa có dữ liệu</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Các cụm sân mới */}
                            <div className="chart-card" style={{ flex: 1 }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
                                    <h3 className="table-card-title" style={{ margin: 0 }}>
                                        <span className="material-symbols-outlined" style={{ verticalAlign: "middle", marginRight: 8, color: "#2563eb" }}>fiber_new</span>
                                        Các cụm sân mới
                                    </h3>
                                </div>
                                <div className="table-scroll">
                                    <table className="owner-table">
                                        <thead>
                                            <tr>
                                                <th>Tên cụm sân</th>
                                                <th>Bộ môn</th>
                                                <th>Trạng thái</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {newCenters.length > 0 ? newCenters.map((c) => {
                                                const isActive = c.status === "ACTIVE";
                                                const sportName = typeof c.sport_id === "object" ? c.sport_id?.name || "N/A" : "N/A";
                                                return (
                                                    <tr key={c._id}>
                                                        <td><strong>{c.name}</strong></td>
                                                        <td><span className="badge badge-sport">{sportName}</span></td>
                                                        <td>
                                                            <span className={`badge ${isActive ? "badge-active" : "badge-inactive"}`}>
                                                                {isActive ? "Hoạt động" : "Tạm đóng"}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            }) : (
                                                <tr><td colSpan={3} style={{ textAlign: "center", padding: 20, color: "#6b7280" }}>Chưa có dữ liệu</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* ── Recent bookings ── */}
                        <div className="table-card">
                            <div className="table-card-header">
                                <h3 className="table-card-title">Yêu cầu booking mới nhất</h3>
                                <Link href="/admin/bookings" className="btn-primary">
                                    Xem tất cả booking
                                </Link>
                            </div>
                            <div className="table-scroll">
                                <table className="owner-table">
                                    <thead>
                                        <tr>
                                            <th>Mã</th>
                                            <th>Khách hàng</th>
                                            <th>Cụm sân / Sân</th>
                                            <th>Ngày đặt</th>
                                            <th>Tổng tiền</th>
                                            <th>Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentBookings.length > 0 ? recentBookings.map((b) => {
                                            const code = b._id ? b._id.slice(-8).toUpperCase() : "";
                                            const customerName = b.user_id?.name || "Khách hàng";
                                            const customerPhone = b.user_id?.phone || "";
                                            const centerName = b.details?.[0]?.court_id?.sport_center_id?.name || "—";
                                            const courtName = b.details?.[0]?.court_id?.court_name || "—";
                                            const statusInfo =
                                                b.status === "PENDING" ? { label: "Chờ duyệt", cls: "pending" } :
                                                    b.status === "CONFIRMED" ? { label: "Đã duyệt", cls: "confirmed" } :
                                                        b.status === "COMPLETED" ? { label: "Hoàn thành", cls: "completed" } :
                                                            { label: "Đã hủy", cls: "cancelled" };
                                            return (
                                                <tr key={b._id}>
                                                    <td><strong style={{ color: "#00236f" }}>{code}</strong></td>
                                                    <td>
                                                        <strong>{customerName}</strong>
                                                        {customerPhone && <div className="sub-text">{customerPhone}</div>}
                                                    </td>
                                                    <td>
                                                        <strong>{centerName}</strong>
                                                        <div className="sub-text">{courtName}</div>
                                                    </td>
                                                    <td>{formatDate(b.booking_for_date)}</td>
                                                    <td><strong>{fmtMoney(b.total_price)}</strong></td>
                                                    <td><span className={`badge badge-${statusInfo.cls}`}>{statusInfo.label}</span></td>
                                                </tr>
                                            );
                                        }) : (
                                            <tr><td colSpan={6} style={{ textAlign: "center", padding: 20, color: "#6b7280" }}>Chưa có booking</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}