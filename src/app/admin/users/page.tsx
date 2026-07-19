"use client";

import { useState } from "react";
import "../page.css";

const ALL_USERS = [
    { id: "1", name: "Nguyễn Văn A", phone: "0987654321", email: "nguyenvana@gmail.com", role: "owner", roleLabel: "Chủ sân", registerDate: "12/01/2026", status: "active", statusLabel: "Kích hoạt" },
    { id: "2", name: "Trần Thị B", phone: "0912345678", email: "tranthib@gmail.com", role: "customer", roleLabel: "Khách hàng", registerDate: "15/02/2026", status: "active", statusLabel: "Kích hoạt" },
    { id: "3", name: "Lê Văn C", phone: "0909998887", email: "levanc@gmail.com", role: "customer", roleLabel: "Khách hàng", registerDate: "10/03/2026", status: "active", statusLabel: "Kích hoạt" },
    { id: "4", name: "Phạm Minh D", phone: "0933445566", email: "phamminhd@gmail.com", role: "customer", roleLabel: "Khách hàng", registerDate: "20/04/2026", status: "blocked", statusLabel: "Bị khóa" }
];

export default function UsersPage() {
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    // Filter logic
    const filteredUsers = ALL_USERS.filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.phone.includes(search) || u.email.toLowerCase().includes(search.toLowerCase());
        const matchesRole = roleFilter === "all" || u.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    return (
        <>
            <header className="admin-topbar">
                <h1 className="admin-topbar-title">Quản lý Người dùng</h1>
                <div className="admin-topbar-right">
                    <span className="admin-topbar-role">Nguyễn Duy Quang</span>
                    <div className="admin-topbar-avatar">A</div>
                </div>
            </header>

            <div className="admin-page-body">
                <div className="page-header">
                    <h3 className="table-card-title">Tài khoản trên hệ thống</h3>
                    <button className="btn-primary" onClick={() => alert("Thêm người dùng mới")}>
                        <span className="material-symbols-outlined">person_add</span> Thêm Người dùng
                    </button>
                </div>

                {/* Filter and Search Bar - 8/2 flex layout */}
                <div className="filter-search-container" style={{ marginBottom: 28 }}>
                    <div className="search-input-wrapper">
                        <span className="material-symbols-outlined">search</span>
                        <input
                            type="text"
                            className="search-field"
                            placeholder="Tìm theo tên khách hàng, số điện thoại, email..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="filter-select-wrapper">
                        <select
                            className="select-filter-field"
                            value={roleFilter}
                            onChange={e => setRoleFilter(e.target.value)}
                        >
                            <option value="all">Tất cả vai trò</option>
                            <option value="owner">Chủ sân - Admin</option>
                            <option value="customer">Khách hàng</option>
                        </select>
                    </div>
                </div>

                <div className="table-card">
                    <div className="table-scroll">
                        <table className="owner-table">
                            <thead>
                                <tr>
                                    <th>Tên khách hàng</th>
                                    <th>Số điện thoại</th>
                                    <th>Email</th>
                                    <th>Vai trò</th>
                                    <th>Ngày đăng ký</th>
                                    <th>Trạng thái</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map(u => (
                                        <tr key={u.id}>
                                            <td><strong>{u.name}</strong></td>
                                            <td>{u.phone}</td>
                                            <td>{u.email}</td>
                                            <td>
                                                <span
                                                    className="badge badge-sport"
                                                    style={
                                                        u.role === "owner"
                                                            ? { background: "#fef3c7", color: "#b45309", borderColor: "#fde68a" }
                                                            : { background: "#e0f2fe", color: "#0369a1", borderColor: "#bae6fd" }
                                                    }
                                                >
                                                    {u.roleLabel}
                                                </span>
                                            </td>
                                            <td>{u.registerDate}</td>
                                            <td>
                                                <span className={`badge ${u.status === "active" ? "badge-active" : "badge-inactive"}`}>
                                                    {u.statusLabel}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-btns">
                                                    {u.status === "active" ? (
                                                        <button className="action-btn cancel" onClick={() => alert("Khóa tài khoản")}>Khóa</button>
                                                    ) : (
                                                        <button className="action-btn approve" onClick={() => alert("Mở khóa tài khoản")}>Mở khóa</button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} style={{ textAlign: "center", padding: "24px", color: "#6b7280" }}>
                                            Không tìm thấy người dùng nào phù hợp
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
