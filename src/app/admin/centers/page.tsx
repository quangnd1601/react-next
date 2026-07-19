"use client";

import { useState } from "react";
import Link from "next/link";
import "../page.css";

const ALL_CENTERS = [
    { id: "1", name: "Cụm Sân Pickleball Thảo Điền", address: "12 Quốc Hương, Thảo Điền, Quận 2, TP. HCM", sport: "pickleball", sportLabel: "Pickleball", courts: 5, status: "active", img: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=100&auto=format&fit=crop" },
    { id: "2", name: "Cụm Sân Tennis Kỳ Hòa", address: "238 Ba Tháng Hai, Quận 10, TP. HCM", sport: "tennis", sportLabel: "Tennis", courts: 8, status: "active", img: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=100&auto=format&fit=crop" },
    { id: "3", name: "Trung Tâm Cầu Lông Sunrise", address: "D11 Đường số 2, Tân Phong, Quận 7, TP. HCM", sport: "badminton", sportLabel: "Cầu lông", courts: 12, status: "active", img: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=100&auto=format&fit=crop" },
];

export default function CentersPage() {
    const [search, setSearch] = useState("");
    const [sportFilter, setSportFilter] = useState("all");
    const [sortOrder, setSortOrder] = useState("name-asc");

    // Filter
    const filtered = ALL_CENTERS.filter(c => {
        const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.address.toLowerCase().includes(search.toLowerCase());
        const matchSport = sportFilter === "all" || c.sport === sportFilter;
        return matchSearch && matchSport;
    });

    // Sort
    const sorted = [...filtered].sort((a, b) => {
        if (sortOrder === "name-asc") return a.name.localeCompare(b.name, "vi");
        if (sortOrder === "name-desc") return b.name.localeCompare(a.name, "vi");
        if (sortOrder === "courts-desc") return b.courts - a.courts;
        if (sortOrder === "courts-asc") return a.courts - b.courts;
        return 0;
    });

    return (
        <>
            <header className="admin-topbar">
                <h1 className="admin-topbar-title">Quản lý Cụm sân</h1>
                <div className="admin-topbar-right">
                    <span className="admin-topbar-role">Nguyễn Duy Quang</span>
                    <div className="admin-topbar-avatar">A</div>
                </div>
            </header>

            <div className="admin-page-body">
                <div className="page-header">
                    <h3 className="table-card-title">Danh sách Cụm sân hoạt động</h3>
                    <Link href="/admin/centers/add" className="btn-primary" style={{ textDecoration: "none" }}>
                        <span className="material-symbols-outlined">add</span> Thêm Cụm sân
                    </Link>
                </div>

                {/* Filter, Search, Sort Bar */}
                <div className="filter-search-container" style={{ marginBottom: 28, display: "flex", gap: "16px", flexWrap: "wrap" }}>
                    <div className="search-input-wrapper" style={{ flex: "5", minWidth: "200px" }}>
                        <span className="material-symbols-outlined">search</span>
                        <input
                            type="text"
                            className="search-field"
                            placeholder="Tìm theo tên cụm sân, địa chỉ..."
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
                            <option value="all">Tất cả môn thể thao</option>
                            <option value="pickleball">Pickleball</option>
                            <option value="tennis">Tennis</option>
                            <option value="badminton">Cầu lông</option>
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
                            <option value="courts-desc">Số sân: Nhiều nhất</option>
                            <option value="courts-asc">Số sân: Ít nhất</option>
                        </select>
                    </div>
                </div>

                <div className="table-card">
                    <div className="table-scroll">
                        <table className="owner-table">
                            <thead>
                                <tr>
                                    <th>Hình ảnh</th>
                                    <th>Tên cụm sân</th>
                                    <th>Địa chỉ</th>
                                    <th>Môn thể thao</th>
                                    <th>Số lượng sân</th>
                                    <th>Trạng thái</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sorted.length > 0 ? (
                                    sorted.map(c => (
                                        <tr key={c.id}>
                                            <td>
                                                <img src={c.img} alt={c.name} style={{ width: 60, height: 40, objectFit: "cover", borderRadius: 6 }} />
                                            </td>
                                            <td><strong>{c.name}</strong></td>
                                            <td>{c.address}</td>
                                            <td><span className="badge badge-sport">{c.sportLabel}</span></td>
                                            <td>{c.courts} sân</td>
                                            <td><span className="badge badge-active">Hoạt động</span></td>
                                            <td>
                                                <div className="action-btns">
                                                    <Link href="/admin/centers/edit" className="action-btn edit" style={{ textDecoration: "none" }}>Sửa</Link>
                                                    <button className="action-btn cancel" onClick={() => alert("Xóa")}>Xóa</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} style={{ textAlign: "center", padding: "24px", color: "#6b7280" }}>
                                            Không tìm thấy cụm sân nào phù hợp
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
