"use client";

import { useState } from "react";
import "../page.css";

const ALL_BOOKINGS = [
    { id: "1", code: "COURT-78932", customer: "Nguyễn Văn A", phone: "0987654321", center: "Pickleball Thảo Điền", court: "Sân 03", date: "2026-07-21", time: "17:00 - 19:00", priceVal: 300000, price: "300.000đ", status: "pending", statusLabel: "Chờ duyệt", statusClass: "pending" },
    { id: "2", code: "COURT-55210", customer: "Trần Thị B", phone: "0912345678", center: "Tennis Kỳ Hòa", court: "Sân Số 2", date: "2026-07-24", time: "19:00 - 21:00", priceVal: 400000, price: "400.000đ", status: "pending", statusLabel: "Chờ duyệt", statusClass: "pending" },
    { id: "3", code: "COURT-12489", customer: "Lê Văn C", phone: "0909998887", center: "Cầu Lông Sunrise", court: "Sân A1", date: "2026-07-15", time: "08:00 - 10:00", priceVal: 180000, price: "180.000đ", status: "confirmed", statusLabel: "Đã duyệt", statusClass: "confirmed" },
    { id: "4", code: "COURT-99812", customer: "Phạm Minh D", phone: "0933445566", center: "Bóng Đá Sport Land", court: "Sân 5B", date: "2026-07-10", time: "16:00 - 17:30", priceVal: 250000, price: "250.000đ", status: "cancelled", statusLabel: "Đã hủy", statusClass: "cancelled" }
];

// Helper to format date display from YYYY-MM-DD to DD/MM/YYYY
const formatDateDisplay = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
};

export default function BookingsPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("");
    const [sortOrder, setSortOrder] = useState("newest"); // "newest", "oldest", "price-desc", "price-asc"

    // Filter logic
    const filteredBookings = ALL_BOOKINGS.filter(b => {
        const matchesSearch = b.customer.toLowerCase().includes(search.toLowerCase()) || b.code.toLowerCase().includes(search.toLowerCase()) || b.center.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "all" || b.status === statusFilter;
        const matchesDate = !dateFilter || b.date === dateFilter;
        return matchesSearch && matchesStatus && matchesDate;
    });

    // Sort logic
    const sortedBookings = [...filteredBookings].sort((a, b) => {
        if (sortOrder === "newest") {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        if (sortOrder === "oldest") {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        if (sortOrder === "price-desc") {
            return b.priceVal - a.priceVal;
        }
        if (sortOrder === "price-asc") {
            return a.priceVal - b.priceVal;
        }
        return 0;
    });

    return (
        <>
            <header className="admin-topbar">
                <h1 className="admin-topbar-title">Quản lý Booking</h1>
                <div className="admin-topbar-right">
                    <span className="admin-topbar-role">Nguyễn Duy Quang</span>
                    <div className="admin-topbar-avatar">A</div>
                </div>
            </header>

            <div className="admin-page-body">
                <div className="page-header">
                    <h3 className="table-card-title">Danh sách Đặt sân</h3>
                </div>

                {/* Filter and Search Bar with Sort dropdown */}
                <div className="filter-search-container" style={{ marginBottom: 28, display: "flex", gap: "16px", flexWrap: "wrap" }}>
                    <div className="search-input-wrapper" style={{ flex: "4", minWidth: "200px" }}>
                        <span className="material-symbols-outlined">search</span>
                        <input 
                            type="text" 
                            className="search-field" 
                            placeholder="Tìm theo mã đặt sân, tên khách hàng, cụm sân..." 
                            value={search} 
                            onChange={e => setSearch(e.target.value)} 
                        />
                    </div>
                    
                    <div style={{ flex: "2", minWidth: "120px" }}>
                        <input 
                            type="date" 
                            className="select-filter-field" 
                            style={{ width: "100%", height: "42px" }}
                            value={dateFilter}
                            onChange={e => setDateFilter(e.target.value)}
                        />
                    </div>

                    <div style={{ flex: "2", minWidth: "140px" }}>
                        <select 
                            className="select-filter-field" 
                            value={sortOrder} 
                            onChange={e => setSortOrder(e.target.value)}
                            style={{ height: "42px", width: "100%" }}
                        >
                            <option value="newest">Ngày đặt: Mới nhất</option>
                            <option value="oldest">Ngày đặt: Cũ nhất</option>
                            <option value="price-desc">Tổng tiền: Giảm dần</option>
                            <option value="price-asc">Tổng tiền: Tăng dần</option>
                        </select>
                    </div>

                    <div className="filter-select-wrapper" style={{ flex: "2", minWidth: "140px" }}>
                        <select 
                            className="select-filter-field" 
                            value={statusFilter} 
                            onChange={e => setStatusFilter(e.target.value)}
                            style={{ height: "42px" }}
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="pending">Chờ duyệt</option>
                            <option value="confirmed">Đã duyệt</option>
                            <option value="cancelled">Đã hủy</option>
                        </select>
                    </div>
                </div>

                <div className="table-card">
                    <div className="table-scroll">
                        <table className="owner-table">
                            <thead>
                                <tr>
                                    <th>Mã</th>
                                    <th>Khách hàng</th>
                                    <th>Cụm sân</th>
                                    <th>Sân</th>
                                    <th>Ngày</th>
                                    <th>Khung giờ</th>
                                    <th>Tổng tiền</th>
                                    <th>Trạng thái</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedBookings.length > 0 ? (
                                    sortedBookings.map(b => (
                                        <tr key={b.id}>
                                            <td><strong style={{ color: "#00236f" }}>{b.code}</strong></td>
                                            <td>
                                                <div><strong>{b.customer}</strong></div>
                                                <div className="sub-text">{b.phone}</div>
                                            </td>
                                            <td>{b.center}</td>
                                            <td>{b.court}</td>
                                            <td>{formatDateDisplay(b.date)}</td>
                                            <td>{b.time}</td>
                                            <td><strong>{b.price}</strong></td>
                                            <td><span className={`badge badge-${b.statusClass}`}>{b.statusLabel}</span></td>
                                            <td>
                                                {b.status === "pending" ? (
                                                    <div className="action-btns">
                                                        <button className="action-btn approve" onClick={() => alert("Đã duyệt")}>Duyệt</button>
                                                        <button className="action-btn cancel" onClick={() => alert("Đã hủy")}>Hủy</button>
                                                    </div>
                                                ) : (
                                                    <span style={{ fontSize: 12, color: "#757682" }}>—</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={9} style={{ textAlign: "center", padding: "24px", color: "#6b7280" }}>
                                            Không tìm thấy booking nào phù hợp
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
