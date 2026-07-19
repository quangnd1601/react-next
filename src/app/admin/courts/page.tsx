"use client";

import { useState } from "react";
import Link from "next/link";
import "../page.css";

const ALL_COURTS = [
    { id: "1", name: "Pickleball Thảo Điền - Sân 03", sport: "pickleball", sportLabel: "Pickleball", priceVal: 150000, price: "150.000đ/giờ", status: "active", statusLabel: "Hoạt động", statusClass: "active", img: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=400&auto=format&fit=crop" },
    { id: "2", name: "Tennis Kỳ Hòa - Sân Số 2", sport: "tennis", sportLabel: "Tennis", priceVal: 200000, price: "200.000đ/giờ", status: "active", statusLabel: "Hoạt động", statusClass: "active", img: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=400&auto=format&fit=crop" },
    { id: "3", name: "Cầu Lông Sunrise - Sân A1", sport: "badminton", sportLabel: "Cầu lông", priceVal: 90000, price: "90.000đ/giờ", status: "active", statusLabel: "Hoạt động", statusClass: "active", img: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=400&auto=format&fit=crop" },
    { id: "4", name: "Bóng Đá Sport Land - Sân 5B", sport: "football", sportLabel: "Bóng đá", priceVal: 180000, price: "180.000đ/giờ", status: "maintenance", statusLabel: "Bảo trì", statusClass: "maintenance", img: "https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=400&auto=format&fit=crop" },
];

export default function CourtsPage() {
    const [search, setSearch] = useState("");
    const [sportFilter, setSportFilter] = useState("all");
    const [sortOrder, setSortOrder] = useState("name-asc");

    // Filter
    const filtered = ALL_COURTS.filter(c => {
        const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
        const matchSport = sportFilter === "all" || c.sport === sportFilter;
        return matchSearch && matchSport;
    });

    // Sort
    const sorted = [...filtered].sort((a, b) => {
        if (sortOrder === "name-asc") return a.name.localeCompare(b.name, "vi");
        if (sortOrder === "name-desc") return b.name.localeCompare(a.name, "vi");
        if (sortOrder === "price-desc") return b.priceVal - a.priceVal;
        if (sortOrder === "price-asc") return a.priceVal - b.priceVal;
        return 0;
    });

    return (
        <>
            <header className="admin-topbar">
                <h1 className="admin-topbar-title">Quản lý Sân</h1>
                <div className="admin-topbar-right">
                    <span className="admin-topbar-role">Nguyễn Duy Quang</span>
                    <div className="admin-topbar-avatar">A</div>
                </div>
            </header>

            <div className="admin-page-body">
                <div className="page-header">
                    <h3 className="table-card-title">Danh sách Sân</h3>
                    <Link href="/admin/courts/add" className="btn-primary" style={{ textDecoration: "none" }}>
                        <span className="material-symbols-outlined">add</span> Thêm sân
                    </Link>
                </div>

                {/* Filter, Search, Sort Bar */}
                <div className="filter-search-container" style={{ marginBottom: 28, display: "flex", gap: "16px", flexWrap: "wrap" }}>
                    <div className="search-input-wrapper" style={{ flex: "5", minWidth: "200px" }}>
                        <span className="material-symbols-outlined">search</span>
                        <input
                            type="text"
                            className="search-field"
                            placeholder="Tìm theo tên sân..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <div style={{ flex: "2.5", minWidth: "140px" }}>
                        <select
                            className="select-filter-field"
                            value={sportFilter}
                            onChange={e => setSportFilter(e.target.value)}
                            style={{ height: "42px", width: "100%" }}
                        >
                            <option value="all">Tất cả bộ môn</option>
                            <option value="pickleball">Pickleball</option>
                            <option value="tennis">Tennis</option>
                            <option value="badminton">Cầu lông</option>
                            <option value="football">Bóng đá</option>
                        </select>
                    </div>
                    <div style={{ flex: "2.5", minWidth: "140px" }}>
                        <select
                            className="select-filter-field"
                            value={sortOrder}
                            onChange={e => setSortOrder(e.target.value)}
                            style={{ height: "42px", width: "100%" }}
                        >
                            <option value="name-asc">Tên: A → Z</option>
                            <option value="name-desc">Tên: Z → A</option>
                            <option value="price-desc">Giá: Cao → Thấp</option>
                            <option value="price-asc">Giá: Thấp → Cao</option>
                        </select>
                    </div>
                </div>

                {sorted.length > 0 ? (
                    <div className="courts-grid">
                        {sorted.map(c => (
                            <div className="court-card" key={c.id}>
                                <img src={c.img} alt={c.name} />
                                <div className="court-card-body">
                                    <div className="court-card-top">
                                        <span className="badge badge-sport">{c.sportLabel}</span>
                                        <span className={`badge badge-${c.statusClass}`}>{c.statusLabel}</span>
                                    </div>
                                    <h4 className="court-card-name">{c.name}</h4>
                                    <p className="court-card-price">Giá thuê: <strong>{c.price}</strong></p>
                                    <div className="court-card-actions">
                                        <Link href="/admin/courts/edit" className="action-btn edit" style={{ textDecoration: "none" }}>Sửa</Link>
                                        {c.status === "active" ? (
                                            <button className="action-btn cancel" onClick={() => alert("Bảo trì")}>Bảo trì</button>
                                        ) : (
                                            <button className="action-btn approve" onClick={() => alert("Kích hoạt")}>Kích hoạt</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: "center", padding: "48px 24px", color: "#6b7280", background: "#fff", borderRadius: 16, border: "1px solid rgba(197,197,211,0.3)" }}>
                        Không tìm thấy sân nào phù hợp
                    </div>
                )}
            </div>
        </>
    );
}
