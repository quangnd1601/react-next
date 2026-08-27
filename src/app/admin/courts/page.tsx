"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { adminCourtService, ICourtAdmin } from "@/services/admin/courtService";
import { useAuth } from "@/context/AuthContext";
import "../page.css";

const DEFAULT_IMG = "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=400&auto=format&fit=crop";

const sportImg: Record<string, string> = {
    pickleball: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=400&auto=format&fit=crop",
    tennis: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=400&auto=format&fit=crop",
    badminton: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=400&auto=format&fit=crop",
    football: "https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=400&auto=format&fit=crop",
};

export default function CourtsPage() {
    const { user } = useAuth();
    const [courts, setCourts] = useState<ICourtAdmin[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sportFilter, setSportFilter] = useState("all");
    const [sortOrder, setSortOrder] = useState("newest");

    // Đối tượng đang xem chi tiết
    const [selectedCourt, setSelectedCourt] = useState<ICourtAdmin | null>(null);

    const loadCourts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await adminCourtService.getAll();
            setCourts(data);
        } catch (err) {
            console.error("Lỗi lấy danh sách sân:", err);
            setError("Lỗi lấy danh sách sân.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        Promise.resolve().then(() => loadCourts());
    }, [loadCourts]);

    // Helper thông tin cụm sân
    const getCenterName = (c: ICourtAdmin) => {
        if (typeof c.sport_center_id === "object" && c.sport_center_id) {
            return c.sport_center_id.name || "—";
        }
        return "—";
    };

    const getCenterAddress = (c: ICourtAdmin) => {
        if (typeof c.sport_center_id === "object" && c.sport_center_id) {
            return c.sport_center_id.address || "";
        }
        return "";
    };

    const getSportName = (c: ICourtAdmin) => {
        if (typeof c.sport_center_id === "object" && c.sport_center_id?.sport_id) {
            return (c.sport_center_id.sport_id as { name: string }).name || "Thể thao";
        }
        return "Thể thao";
    };

    const getSportImg = (c: ICourtAdmin) => {
        // Nếu sân có thumbnail riêng thì dùng ảnh của sân
        if (c.thumbnail) return c.thumbnail;
        const sportKey = getSportName(c).toLowerCase();
        for (const key of Object.keys(sportImg)) {
            if (sportKey.includes(key)) return sportImg[key];
        }
        return DEFAULT_IMG;
    };

    const getStatusMeta = (status: string) => {
        switch (status) {
            case "ACTIVE": return { label: "Hoạt động", cls: "active" };
            case "MAINTENANCE": return { label: "Bảo trì", cls: "maintenance" };
            case "INACTIVE": return { label: "Tạm đóng", cls: "inactive" };
            default: return { label: status, cls: "inactive" };
        }
    };

    const nextStatus = (status: string) =>
        status === "ACTIVE" ? "MAINTENANCE" : "ACTIVE";

    // Filter
    const filtered = courts.filter((c) => {
        const matchSearch =
            c.court_name.toLowerCase().includes(search.toLowerCase()) ||
            getCenterName(c).toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === "all" || c.status === statusFilter;
        const sportName = getSportName(c).toLowerCase();
        const matchSport = sportFilter === "all" || sportName.includes(sportFilter);
        return matchSearch && matchStatus && matchSport;
    });

    // Sort
    const sorted = [...filtered].sort((a, b) => {
        if (sortOrder === "name-asc") return a.court_name.localeCompare(b.court_name, "vi");
        if (sortOrder === "name-desc") return b.court_name.localeCompare(a.court_name, "vi");
        if (sortOrder === "price-desc") return (b.price || 0) - (a.price || 0);
        if (sortOrder === "price-asc") return (a.price || 0) - (b.price || 0);
        const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
        const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
        // Mặc định: sân thêm mới hiện SAU CÙNG
        return aTime - bTime;
    });

    // Chuyển trạng thái nhanh
    const handleToggleStatus = async (court: ICourtAdmin) => {
        const next = nextStatus(court.status);
        const meta = getStatusMeta(next);
        if (!window.confirm(`Chuyển sân "${court.court_name}" sang "${meta.label}"?`)) return;
        try {
            const res = await adminCourtService.update(court._id, { status: next });
            if (res.success) {
                alert(`Đã chuyển trạng thái sang "${meta.label}"!`);
                loadCourts();
                if (selectedCourt && selectedCourt._id === court._id) {
                    setSelectedCourt(null);
                }
            } else {
                alert(res.message || "Cập nhật thất bại.");
            }
        } catch (err) {
            console.error(err);
            alert("Có lỗi xảy ra khi cập nhật trạng thái.");
        }
    };

    // Xóa sân
    const handleDelete = async (court: ICourtAdmin) => {
        if (!window.confirm(
            `Bạn có chắc chắn muốn xóa sân "${court.court_name}" không?\n\n` +
            `⚠️ Lưu ý: Nếu sân còn đơn đặt sân đang hoạt động (chờ duyệt / đã duyệt / hoàn thành), hệ thống sẽ TỪ CHỐI xóa.\n` +
            `Cách an toàn: chuyển sân sang trạng thái INACTIVE (tạm đóng) thay vì xóa.`
        )) return;
        try {
            const res = await adminCourtService.delete(court._id);
            if (res.success) {
                alert("Xóa sân thành công!");
                loadCourts();
                if (selectedCourt && selectedCourt._id === court._id) {
                    setSelectedCourt(null);
                }
            } else {
                alert(res.message || "Xóa sân thất bại.");
            }
        } catch (err) {
            console.error(err);
            alert("Có lỗi xảy ra khi xóa sân.");
        }
    };

    return (
        <>
            <header className="admin-topbar">
                <h1 className="admin-topbar-title">Quản lý Sân</h1>
                <div className="admin-topbar-right">
                    <span className="admin-topbar-role">{user?.name || user?.email || "Admin"}</span>
                    <div className="admin-topbar-avatar">
                        {(user?.name || user?.email || "A").charAt(0).toUpperCase()}
                    </div>
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
                    <div className="search-input-wrapper" style={{ flex: "4", minWidth: "200px" }}>
                        <span className="material-symbols-outlined">search</span>
                        <input
                            type="text"
                            className="search-field"
                            placeholder="Tìm theo tên sân, cụm sân..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="filter-select-wrapper" style={{ flex: "2", minWidth: "140px" }}>
                        <select
                            className="select-filter-field"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={{ height: "42px" }}
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="ACTIVE">Hoạt động</option>
                            <option value="MAINTENANCE">Bảo trì</option>
                            <option value="INACTIVE">Tạm đóng</option>
                        </select>
                    </div>

                    <div className="filter-select-wrapper" style={{ flex: "2", minWidth: "140px" }}>
                        <select
                            className="select-filter-field"
                            value={sportFilter}
                            onChange={(e) => setSportFilter(e.target.value)}
                            style={{ height: "42px" }}
                        >
                            <option value="all">Tất cả bộ môn</option>
                            <option value="pickleball">Pickleball</option>
                            <option value="tennis">Tennis</option>
                            <option value="badminton">Cầu lông</option>
                            <option value="football">Bóng đá</option>
                        </select>
                    </div>

                    <div className="filter-select-wrapper" style={{ flex: "2", minWidth: "140px" }}>
                        <select
                            className="select-filter-field"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            style={{ height: "42px" }}
                        >
                            <option value="newest">Mới nhất</option>
                            <option value="name-asc">Tên: A → Z</option>
                            <option value="name-desc">Tên: Z → A</option>
                            <option value="price-desc">Giá: Cao → Thấp</option>
                            <option value="price-asc">Giá: Thấp → Cao</option>
                        </select>
                    </div>
                </div>

                <div className="table-card">
                    <div className="table-scroll">
                        {loading ? (
                            <div style={{ textAlign: "center", padding: "48px", color: "#6b7280" }}>
                                Đang tải danh sách sân...
                            </div>
                        ) : error ? (
                            <div style={{ textAlign: "center", padding: "48px", color: "#dc2626" }}>
                                Lỗi: {error}
                            </div>
                        ) : (
                            <table className="owner-table">
                                <thead>
                                    <tr>
                                        <th>Sân</th>
                                        <th>Cụm sân</th>
                                        <th>Bộ môn</th>
                                        <th>Giá</th>
                                        <th>Trạng thái</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sorted.length > 0 ? (
                                        sorted.map((c) => {
                                            const statusMeta = getStatusMeta(c.status);
                                            return (
                                                <tr key={c._id}>
                                                    <td>
                                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                            <img
                                                                src={getSportImg(c)}
                                                                alt={c.court_name}
                                                                style={{ width: 56, height: 40, objectFit: "cover", borderRadius: 6 }}
                                                            />
                                                            <div>
                                                                <strong>{c.court_name}</strong>
                                                                {c.price ? (
                                                                    <div className="sub-text">
                                                                        {c.price.toLocaleString("vi-VN")}đ{/* Giá thường */}
                                                                        {c.peak_price ? ` • Cao điểm ${c.peak_price.toLocaleString("vi-VN")}đ` : ""}
                                                                    </div>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div><strong>{getCenterName(c)}</strong></div>
                                                        <div className="sub-text">{getCenterAddress(c) || "—"}</div>
                                                    </td>
                                                    <td>
                                                        <span className="badge badge-sport">{getSportName(c)}</span>
                                                    </td>
                                                    <td style={{ whiteSpace: "nowrap" }}>
                                                        <strong>{c.price ? `${c.price.toLocaleString("vi-VN")}đ` : "Liên hệ"}</strong>
                                                        {c.peak_price ? (
                                                            <div className="sub-text" style={{ color: "#ed6c02" }}>
                                                                Cao điểm: {c.peak_price.toLocaleString("vi-VN")}đ
                                                            </div>
                                                        ) : null}
                                                    </td>
                                                    <td>
                                                        <span className={`badge badge-${statusMeta.cls}`}>{statusMeta.label}</span>
                                                    </td>
                                                    <td>
                                                        <div className="booking-action-cell">
                                                            <button className="booking-view-btn" onClick={() => setSelectedCourt(c)}>
                                                                <span className="material-symbols-outlined">visibility</span>
                                                                Xem chi tiết
                                                            </button>
                                                            <div className="booking-row-actions">
                                                                <Link
                                                                    href={`/admin/courts/edit/${c._id}`}
                                                                    className="action-btn edit"
                                                                    style={{ textDecoration: "none" }}
                                                                >
                                                                    Sửa
                                                                </Link>
                                                                <button
                                                                    className={`action-btn ${c.status === "ACTIVE" ? "complete" : "approve"}`}
                                                                    onClick={() => handleToggleStatus(c)}
                                                                    title="Chuyển trạng thái"
                                                                >
                                                                    {c.status === "ACTIVE" ? "Bảo trì" : "Kích hoạt"}
                                                                </button>
                                                                <button
                                                                    className="action-btn cancel"
                                                                    onClick={() => handleDelete(c)}
                                                                >
                                                                    Xóa
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={6} style={{ textAlign: "center", padding: "24px", color: "#6b7280" }}>
                                                Không tìm thấy sân nào phù hợp
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {/* --- Modal Xem Chi Tiết Sân --- */}
            {selectedCourt && (
                <div className="booking-modal-overlay" onClick={() => setSelectedCourt(null)}>
                    <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="booking-modal-header">
                            <h3 className="booking-modal-title">Chi Tiết Sân</h3>
                            <button className="booking-modal-close" onClick={() => setSelectedCourt(null)}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="booking-modal-body">
                            {(() => {
                                const c = selectedCourt;
                                const statusMeta = getStatusMeta(c.status);
                                const centerName = getCenterName(c);
                                const address = getCenterAddress(c);
                                const sportName = getSportName(c);

                                return (
                                    <>
                                        <div className="booking-modal-status-row">
                                            <div>
                                                <span className="booking-modal-label">Tên sân</span>
                                                <div className="booking-modal-code">{c.court_name}</div>
                                            </div>
                                            <div className="booking-modal-badges">
                                                <span className={`booking-badge status-${statusMeta.cls}`}>{statusMeta.label}</span>
                                                <span className="booking-badge payment-paid">{sportName}</span>
                                            </div>
                                        </div>

                                        <div className="booking-modal-section" style={{ textAlign: "center" }}>
                                            <img
                                                src={getSportImg(c)}
                                                alt={c.court_name}
                                                style={{ maxWidth: "100%", maxHeight: 200, objectFit: "cover", borderRadius: 12 }}
                                            />
                                        </div>

                                        <div className="booking-modal-section">
                                            <h4 className="booking-modal-section-title">
                                                <span className="material-symbols-outlined">info</span>
                                                Thông tin chung
                                            </h4>
                                            <div className="booking-modal-info-grid">
                                                <div className="booking-modal-info-item">
                                                    <span className="booking-modal-info-label">Cụm sân</span>
                                                    <span className="booking-modal-info-value">{centerName}</span>
                                                </div>
                                                <div className="booking-modal-info-item">
                                                    <span className="booking-modal-info-label">Bộ môn</span>
                                                    <span className="booking-modal-info-value">{sportName}</span>
                                                </div>
                                                <div className="booking-modal-info-item">
                                                    <span className="booking-modal-info-label">Giá thường</span>
                                                    <span className="booking-modal-info-value">
                                                        {c.price ? `${c.price.toLocaleString("vi-VN")}đ/giờ` : "Liên hệ"}
                                                    </span>
                                                </div>
                                                <div className="booking-modal-info-item">
                                                    <span className="booking-modal-info-label">Giá cao điểm</span>
                                                    <span className="booking-modal-info-value">
                                                        {c.peak_price ? `${c.peak_price.toLocaleString("vi-VN")}đ/giờ` : "—"}
                                                    </span>
                                                </div>
                                                {address && (
                                                    <div className="booking-modal-info-item full">
                                                        <span className="booking-modal-info-label">Địa chỉ</span>
                                                        <span className="booking-modal-info-value">{address}</span>
                                                    </div>
                                                )}
                                                <div className="booking-modal-info-item">
                                                    <span className="booking-modal-info-label">Lượt đặt</span>
                                                    <span className="booking-modal-info-value">{c.total_bookings ?? 0}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Thao tác trong modal */}
                                        <div className="booking-modal-actions">
                                            <Link
                                                href={`/admin/courts/edit/${c._id}`}
                                                className="action-btn edit"
                                                style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "8px 14px", flex: 1, minWidth: 120, fontSize: 13, fontWeight: 700, borderRadius: 8, border: "1px solid #93c5fd" }}
                                            >
                                                Sửa
                                            </Link>
                                            <button
                                                className={`action-btn ${c.status === "ACTIVE" ? "complete" : "approve"}`}
                                                onClick={() => handleToggleStatus(c)}
                                                style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "8px 14px", flex: 1, minWidth: 120, fontSize: 13, fontWeight: 700, borderRadius: 8, border: "1px solid #6ee7b7" }}
                                            >
                                                {c.status === "ACTIVE" ? "Chuyển bảo trì" : "Kích hoạt"}
                                            </button>
                                            <button
                                                className="action-btn cancel"
                                                onClick={() => handleDelete(c)}
                                                style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "8px 14px", flex: 1, minWidth: 120, fontSize: 13, fontWeight: 700, borderRadius: 8, border: "1px solid #fca5a5" }}
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}