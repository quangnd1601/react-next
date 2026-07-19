"use client";

import { useState } from "react";
import Link from "next/link";
import "./page.css";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend,
    AreaChart, Area
} from "recharts";

const fmtMoney = (n: number) => n.toLocaleString("vi-VN") + "đ";

/* ── Biểu đồ Doanh thu theo tháng ── */
const revenueData = [
    { month: "T1", revenue: 8200000 },
    { month: "T2", revenue: 9500000 },
    { month: "T3", revenue: 11000000 },
    { month: "T4", revenue: 10200000 },
    { month: "T5", revenue: 13800000 },
    { month: "T6", revenue: 15400000 },
    { month: "T7", revenue: 18400000 },
];

/* ── Biểu đồ Booking theo ngày (7 ngày gần nhất) ── */
const bookingTrendData = [
    { day: "14/07", bookings: 5 },
    { day: "15/07", bookings: 8 },
    { day: "16/07", bookings: 6 },
    { day: "17/07", bookings: 11 },
    { day: "18/07", bookings: 9 },
    { day: "19/07", bookings: 14 },
    { day: "20/07", bookings: 12 },
];

/* ── Phân bổ môn thể thao ── */
const sportDistribution = [
    { name: "Pickleball", value: 18, color: "#2563eb" },
    { name: "Tennis", value: 12, color: "#16a34a" },
    { name: "Cầu lông", value: 10, color: "#d97706" },
    { name: "Bóng đá", value: 8, color: "#dc2626" },
];

/* ── Top cụm sân được đặt nhiều nhất ── */
const topCenters = [
    { name: "Cụm Sân Pickleball Thảo Điền", sport: "Pickleball", bookings: 86, revenue: 12900000 },
    { name: "Cụm Sân Tennis Kỳ Hòa", sport: "Tennis", bookings: 72, revenue: 14400000 },
    { name: "Trung Tâm Cầu Lông Sunrise", sport: "Cầu lông", bookings: 58, revenue: 5220000 },
    { name: "Bóng Đá Sport Land", sport: "Bóng đá", bookings: 41, revenue: 7380000 },
    { name: "Tennis Phú Mỹ Hưng", sport: "Tennis", bookings: 35, revenue: 7000000 },
];

/* ── Top sân được đặt nhiều nhất ── */
const topCourts = [
    { name: "Sân 03 - Pickleball Thảo Điền", sport: "Pickleball", bookings: 32 },
    { name: "Sân Số 2 - Tennis Kỳ Hòa", sport: "Tennis", bookings: 28 },
    { name: "Sân A1 - Cầu Lông Sunrise", sport: "Cầu lông", bookings: 24 },
    { name: "Sân 01 - Pickleball Thảo Điền", sport: "Pickleball", bookings: 22 },
    { name: "Sân 5B - Bóng Đá Sport Land", sport: "Bóng đá", bookings: 19 },
];

/* Custom Tooltip for revenue chart */
const RevenueTooltip = ({ active, payload, label }: any) => {
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

export default function AdminPage() {
    // Filter states for Top Centers
    const [centerTimeFilter, setCenterTimeFilter] = useState("month");
    const [centerSportFilter, setCenterSportFilter] = useState("all");
    // Filter states for Top Courts
    const [courtTimeFilter, setCourtTimeFilter] = useState("month");
    const [courtSportFilter, setCourtSportFilter] = useState("all");

    // Filter logic (hardcoded data — chỉ lọc theo bộ môn, thời gian chỉ để UI)
    const filteredTopCenters = topCenters.filter(c => centerSportFilter === "all" || c.sport === centerSportFilter);
    const filteredTopCourts = topCourts.filter(c => courtSportFilter === "all" || c.sport === courtSportFilter);

    return (
        <>
            <header className="admin-topbar">
                <h1 className="admin-topbar-title">Tổng quan hệ thống</h1>
                <div className="admin-topbar-right">
                    <span className="admin-topbar-role">Nguyễn Duy Quang</span>
                    <div className="admin-topbar-avatar">A</div>
                </div>
            </header>

            <div className="admin-page-body">
                {/* ── KPI Stat cards ── */}
                <div className="stat-grid">
                    <div className="stat-card">
                        <div className="stat-icon green"><span className="material-symbols-outlined">payments</span></div>
                        <div>
                            <span className="stat-label">Doanh thu tháng</span>
                            <p className="stat-value">{fmtMoney(18400000)}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon blue"><span className="material-symbols-outlined">event_note</span></div>
                        <div>
                            <span className="stat-label">Tổng booking</span>
                            <p className="stat-value">48</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon purple"><span className="material-symbols-outlined">stadium</span></div>
                        <div>
                            <span className="stat-label">Tổng Cụm sân</span>
                            <p className="stat-value">12</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon orange"><span className="material-symbols-outlined">sports_tennis</span></div>
                        <div>
                            <span className="stat-label">Tổng số sân</span>
                            <p className="stat-value">42</p>
                        </div>
                    </div>
                </div>

                {/* ── Booking status mini ── */}
                <div className="booking-status-row">
                    <div className="booking-status-box pending">
                        <span className="booking-status-num">5</span>
                        <span className="booking-status-lbl">Chờ duyệt</span>
                    </div>
                    <div className="booking-status-box confirmed">
                        <span className="booking-status-num">18</span>
                        <span className="booking-status-lbl">Đã xác nhận</span>
                    </div>
                    <div className="booking-status-box completed">
                        <span className="booking-status-num">20</span>
                        <span className="booking-status-lbl">Hoàn thành</span>
                    </div>
                    <div className="booking-status-box cancelled">
                        <span className="booking-status-num">5</span>
                        <span className="booking-status-lbl">Đã hủy</span>
                    </div>
                </div>

                {/* ── CHARTS ROW ── */}
                <div className="dashboard-charts-row">
                    {/* Biểu đồ doanh thu theo tháng */}
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

                    {/* Biểu đồ phân bổ môn thể thao */}
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
                                    label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
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

                {/* ── TOP CỤM SÂN & SÂN ── */}
                <div className="dashboard-charts-row">
                    {/* Top cụm sân */}
                    <div className="chart-card" style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
                            <h3 className="table-card-title" style={{ margin: 0 }}>
                                <span className="material-symbols-outlined" style={{ verticalAlign: "middle", marginRight: 8, color: "#ea580c" }}>emoji_events</span>
                                Top Cụm sân đặt nhiều nhất
                            </h3>
                            <div style={{ display: "flex", gap: 8 }}>
                                <select className="select-filter-field" value={centerTimeFilter} onChange={e => setCenterTimeFilter(e.target.value)} style={{ height: 36, fontSize: 12, padding: "0 10px", minWidth: 120 }}>
                                    <option value="month">Tháng này</option>
                                    <option value="week">Tuần này</option>
                                    <option value="quarter">Quý này</option>
                                    <option value="year">Năm nay</option>
                                </select>
                                <select className="select-filter-field" value={centerSportFilter} onChange={e => setCenterSportFilter(e.target.value)} style={{ height: 36, fontSize: 12, padding: "0 10px", minWidth: 120 }}>
                                    <option value="all">Tất cả bộ môn</option>
                                    <option value="Pickleball">Pickleball</option>
                                    <option value="Tennis">Tennis</option>
                                    <option value="Cầu lông">Cầu lông</option>
                                    <option value="Bóng đá">Bóng đá</option>
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
                                    {filteredTopCenters.length > 0 ? filteredTopCenters.map((c, idx) => (
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
                                        <tr><td colSpan={5} style={{ textAlign: "center", padding: 20, color: "#6b7280" }}>Không có dữ liệu</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Top sân */}
                    <div className="chart-card" style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
                            <h3 className="table-card-title" style={{ margin: 0 }}>
                                <span className="material-symbols-outlined" style={{ verticalAlign: "middle", marginRight: 8, color: "#2563eb" }}>star</span>
                                Top Sân được đặt nhiều nhất
                            </h3>
                            <div style={{ display: "flex", gap: 8 }}>
                                <select className="select-filter-field" value={courtTimeFilter} onChange={e => setCourtTimeFilter(e.target.value)} style={{ height: 36, fontSize: 12, padding: "0 10px", minWidth: 120 }}>
                                    <option value="month">Tháng này</option>
                                    <option value="week">Tuần này</option>
                                    <option value="quarter">Quý này</option>
                                    <option value="year">Năm nay</option>
                                </select>
                                <select className="select-filter-field" value={courtSportFilter} onChange={e => setCourtSportFilter(e.target.value)} style={{ height: 36, fontSize: 12, padding: "0 10px", minWidth: 120 }}>
                                    <option value="all">Tất cả bộ môn</option>
                                    <option value="Pickleball">Pickleball</option>
                                    <option value="Tennis">Tennis</option>
                                    <option value="Cầu lông">Cầu lông</option>
                                    <option value="Bóng đá">Bóng đá</option>
                                </select>
                            </div>
                        </div>
                        <div className="table-scroll">
                            <table className="owner-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Tên sân</th>
                                        <th>Bộ môn</th>
                                        <th>Lượt đặt</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTopCourts.length > 0 ? filteredTopCourts.map((c, idx) => (
                                        <tr key={c.name}>
                                            <td>
                                                <span style={{
                                                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                                                    width: 28, height: 28, borderRadius: "50%", fontWeight: 700, fontSize: 12,
                                                    background: idx < 3 ? "#eff6ff" : "#f3f4f6",
                                                    color: idx < 3 ? "#2563eb" : "#6b7280",
                                                    border: idx < 3 ? "1px solid #93c5fd" : "1px solid #e5e7eb"
                                                }}>
                                                    {idx + 1}
                                                </span>
                                            </td>
                                            <td><strong>{c.name}</strong></td>
                                            <td><span className="badge badge-sport">{c.sport}</span></td>
                                            <td><strong style={{ color: "#00236f" }}>{c.bookings}</strong></td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={4} style={{ textAlign: "center", padding: 20, color: "#6b7280" }}>Không có dữ liệu</td></tr>
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
                                    <th>Cụm sân</th>
                                    <th>Sân</th>
                                    <th>Ngày đặt</th>
                                    <th>Tổng tiền</th>
                                    <th>Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong style={{ color: "#00236f" }}>COURT-78932</strong></td>
                                    <td>Nguyễn Văn A</td>
                                    <td>Pickleball Thảo Điền</td>
                                    <td>Sân 03</td>
                                    <td>26/07/2026</td>
                                    <td><strong>{fmtMoney(300000)}</strong></td>
                                    <td><span className="badge badge-pending">Chờ duyệt</span></td>
                                </tr>
                                <tr>
                                    <td><strong style={{ color: "#00236f" }}>COURT-55210</strong></td>
                                    <td>Trần Thị B</td>
                                    <td>Tennis Kỳ Hòa</td>
                                    <td>Sân Số 2</td>
                                    <td>24/07/2026</td>
                                    <td><strong>{fmtMoney(400000)}</strong></td>
                                    <td><span className="badge badge-pending">Chờ duyệt</span></td>
                                </tr>
                                <tr>
                                    <td><strong style={{ color: "#00236f" }}>COURT-12489</strong></td>
                                    <td>Lê Văn C</td>
                                    <td>Cầu Lông Sunrise</td>
                                    <td>Sân A1</td>
                                    <td>15/07/2026</td>
                                    <td><strong>{fmtMoney(180000)}</strong></td>
                                    <td><span className="badge badge-confirmed">Đã duyệt</span></td>
                                </tr>
                                <tr>
                                    <td><strong style={{ color: "#00236f" }}>COURT-99812</strong></td>
                                    <td>Phạm Minh D</td>
                                    <td>Bóng Đá Sport Land</td>
                                    <td>Sân 5B</td>
                                    <td>10/07/2026</td>
                                    <td><strong>{fmtMoney(250000)}</strong></td>
                                    <td><span className="badge badge-cancelled">Đã hủy</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
