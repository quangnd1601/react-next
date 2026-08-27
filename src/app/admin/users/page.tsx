"use client";

import { useEffect, useState, useCallback } from "react";
import { adminUserService } from "@/services/admin/userService";
import { useAuth } from "@/context/AuthContext";
import { IUser } from "@/interface/auth";
import "../page.css";

const fmtDate = (s?: string | Date) => {
    if (!s) return "—";
    const d = new Date(s as string);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};

export default function UsersPage() {
    const { user } = useAuth();
    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    const loadUsers = useCallback(async () => {
        setLoading(true);
        try {
            setUsers(await adminUserService.getAll());
        } catch {
            setError("Lỗi tải danh sách người dùng.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        Promise.resolve().then(() => loadUsers());
    }, [loadUsers]);

    const handleLock = async (u: IUser, isLock: boolean) => {
        const action = isLock ? "khóa" : "mở khóa";
        if (!window.confirm(`Bạn có chắc chắn muốn ${action} tài khoản "${u.name}"?`)) return;
        const res = isLock
            ? await adminUserService.lock(u._id || "")
            : await adminUserService.unlock(u._id || "");
        if (res.success) {
            alert(`${isLock ? "Khóa" : "Mở khóa"} tài khoản thành công!`);
            loadUsers();
        } else {
            alert(res.message || "Thao tác thất bại.");
        }
    };

    const filteredUsers = users.filter((u) => {
        const name = u.name?.toLowerCase() || "";
        const phone = u.phone || "";
        const email = u.email?.toLowerCase() || "";
        const q = search.toLowerCase();
        const matchesSearch = name.includes(q) || phone.includes(q) || email.includes(q);
        const matchesRole = roleFilter === "all" || (u.role || "").toLowerCase() === roleFilter;
        return matchesSearch && matchesRole;
    });

    return (
        <>
            <header className="admin-topbar">
                <h1 className="admin-topbar-title">Quản lý Người dùng</h1>
                <div className="admin-topbar-right">
                    <span className="admin-topbar-role">{user?.name || user?.email || "Admin"}</span>
                    <div className="admin-topbar-avatar">{(user?.name || "A").charAt(0).toUpperCase()}</div>
                </div>
            </header>

            <div className="admin-page-body">
                <div className="page-header">
                    <h3 className="table-card-title">Tài khoản trên hệ thống</h3>
                </div>

                <div className="filter-search-container" style={{ marginBottom: 28, display: "flex", gap: "16px", flexWrap: "wrap" }}>
                    <div className="search-input-wrapper" style={{ flex: "4", minWidth: "220px" }}>
                        <span className="material-symbols-outlined">search</span>
                        <input
                            type="text"
                            className="search-field"
                            placeholder="Tìm theo tên, số điện thoại, email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="filter-select-wrapper" style={{ flex: "2", minWidth: "150px" }}>
                        <select
                            className="select-filter-field"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            style={{ height: "42px" }}
                        >
                            <option value="all">Tất cả vai trò</option>
                            <option value="admin">Admin</option>
                            <option value="customer">Khách hàng</option>
                        </select>
                    </div>
                </div>

                <div className="table-card">
                    <div className="table-scroll">
                        {loading ? (
                            <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>Đang tải danh sách người dùng...</div>
                        ) : error ? (
                            <div style={{ textAlign: "center", padding: "40px", color: "#dc2626" }}>Lỗi: {error}</div>
                        ) : (
                            <table className="owner-table">
                                <thead>
                                    <tr>
                                        <th>Tên người dùng</th>
                                        <th>Số điện thoại</th>
                                        <th>Email</th>
                                        <th>Vai trò</th>
                                        <th>Ngày đăng ký</th>
                                        <th>Trạng thái</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.length > 0 ? filteredUsers.map((u) => (
                                        <tr key={u._id}>
                                            <td><strong>{u.name}</strong></td>
                                            <td>{u.phone || "—"}</td>
                                            <td>{u.email}</td>
                                            <td>
                                                <span
                                                    className="badge badge-sport"
                                                    style={
                                                        u.role === "ADMIN"
                                                            ? { background: "#fef3c7", color: "#b45309", borderColor: "#fde68a" }
                                                            : { background: "#e0f2fe", color: "#0369a1", borderColor: "#bae6fd" }
                                                    }
                                                >
                                                    {u.role === "ADMIN" ? "Admin" : "Khách hàng"}
                                                </span>
                                            </td>
                                            <td>{fmtDate(u.created_at)}</td>
                                            <td>
                                                <span className={`badge ${u.status === "BANNED" ? "badge-inactive" : "badge-active"}`}>
                                                    {u.status === "BANNED" ? "Bị khóa" : u.status === "INACTIVE" ? "Không hoạt động" : "Hoạt động"}
                                                </span>
                                            </td>
                                            <td>
                                                {u.status === "BANNED" ? (
                                                    <button className="action-btn approve" onClick={() => handleLock(u, false)}>Mở khóa</button>
                                                ) : (
                                                    <button className="action-btn cancel" onClick={() => handleLock(u, true)}>Khóa</button>
                                                )}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={7} style={{ textAlign: "center", padding: "24px", color: "#6b7280" }}>Không tìm thấy người dùng nào phù hợp</td></tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}