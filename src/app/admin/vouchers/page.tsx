"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { adminVoucherService, IVoucher } from "@/services/admin/voucherService";
import { useAuth } from "@/context/AuthContext";
import "../page.css";

const fmtPrice = (n?: number) => (n ? `${n.toLocaleString("vi-VN")}đ` : "—");
const fmtDate = (s?: string) => {
    if (!s) return "—";
    const d = new Date(s);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};
const toDateInput = (s?: string) => {
    if (!s) return "";
    const d = new Date(s);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export default function VouchersPage() {
    const { user } = useAuth();
    const [vouchers, setVouchers] = useState<IVoucher[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editing, setEditing] = useState<IVoucher | null>(null);
    const [saving, setSaving] = useState(false);

    // Form state cho modal sửa
    const [fCode, setFCode] = useState("");
    const [fType, setFType] = useState<"PERCENTAGE" | "FIXED">("PERCENTAGE");
    const [fValue, setFValue] = useState("");
    const [fMinOrder, setFMinOrder] = useState("");
    const [fMaxDiscount, setFMaxDiscount] = useState("");
    const [fStart, setFStart] = useState("");
    const [fEnd, setFEnd] = useState("");
    const [fUsageLimit, setFUsageLimit] = useState("");
    const [fStatus, setFStatus] = useState("ACTIVE");

    const loadVouchers = useCallback(async () => {
        setLoading(true);
        try {
            setVouchers(await adminVoucherService.getAll());
        } catch {
            setError("Lỗi tải danh sách voucher.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        Promise.resolve().then(() => loadVouchers());
    }, [loadVouchers]);

    const openEditModal = (v: IVoucher) => {
        setEditing(v);
        setFCode(v.code);
        setFType(v.discount_type);
        setFValue(String(v.discount_value));
        setFMinOrder(String(v.min_order_value || ""));
        setFMaxDiscount(String(v.max_discount_amount || ""));
        setFStart(toDateInput(v.start_date));
        setFEnd(toDateInput(v.end_date));
        setFUsageLimit(String(v.usage_limit || ""));
        setFStatus(v.status);
    };

    const closeModal = () => {
        setEditing(null);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editing) return;
        if (!fCode.trim() || !fValue.trim() || !fStart || !fEnd) {
            alert("Vui lòng điền đủ mã, mức giảm, ngày bắt đầu và kết thúc.");
            return;
        }
        setSaving(true);
        try {
            const payload: Partial<IVoucher> = {
                code: fCode.trim(),
                discount_type: fType,
                discount_value: Number(fValue.replace(/[^\d]/g, "")),
                min_order_value: Number(fMinOrder.replace(/[^\d]/g, "")) || 0,
                max_discount_amount: fMaxDiscount ? Number(fMaxDiscount.replace(/[^\d]/g, "")) : undefined,
                start_date: new Date(fStart).toISOString(),
                end_date: new Date(fEnd).toISOString(),
                usage_limit: fUsageLimit ? Number(fUsageLimit.replace(/[^\d]/g, "")) : undefined,
                status: fStatus,
            };
            const res = await adminVoucherService.update(editing._id, payload);
            if (res.success) {
                alert("Cập nhật voucher thành công!");
                closeModal();
                loadVouchers();
            } else {
                alert(res.message || "Cập nhật thất bại.");
            }
        } catch (err) {
            console.error(err);
            alert("Có lỗi xảy ra khi cập nhật voucher.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (v: IVoucher) => {
        if (!window.confirm(`Xóa voucher "${v.code}"?`)) return;
        const res = await adminVoucherService.delete(v._id);
        alert(res.success ? "Xóa voucher thành công!" : res.message || "Xóa thất bại.");
        if (res.success) loadVouchers();
    };

    const handleToggleStatus = async (v: IVoucher) => {
        const next = v.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        if (!window.confirm(`Chuyển voucher "${v.code}" sang ${next === "ACTIVE" ? "Hoạt động" : "Ngừng hoạt động"}?`)) return;
        const res = await adminVoucherService.update(v._id, { status: next });
        alert(res.success ? "Đã cập nhật trạng thái!" : res.message || "Cập nhật thất bại.");
        if (res.success) loadVouchers();
    };

    return (
        <>
            <header className="admin-topbar">
                <h1 className="admin-topbar-title">Quản lý Voucher</h1>
                <div className="admin-topbar-right">
                    <span className="admin-topbar-role">{user?.name || user?.email || "Admin"}</span>
                    <div className="admin-topbar-avatar">A</div>
                </div>
            </header>
            <div className="admin-page-body">
                <div className="page-header">
                    <h3 className="table-card-title">Danh sách Chương trình khuyến mãi</h3>
                    <Link href="/admin/vouchers/add" className="btn-primary" style={{ textDecoration: "none" }}>
                        <span className="material-symbols-outlined">add</span> Thêm Voucher
                    </Link>
                </div>
                <div className="table-card">
                    <div className="table-scroll">
                        {loading ? (
                            <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>Đang tải...</div>
                        ) : error ? (
                            <div style={{ textAlign: "center", padding: "40px", color: "#dc2626" }}>{error}</div>
                        ) : (
                            <table className="owner-table">
                                <thead>
                                    <tr>
                                        <th>Mã code</th>
                                        <th>Mức giảm</th>
                                        <th>Giảm tối đa</th>
                                        <th>Tối thiểu</th>
                                        <th>Hạn sử dụng</th>
                                        <th>Lượt dùng</th>
                                        <th>Trạng thái</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vouchers.length > 0 ? vouchers.map((v) => (
                                        <tr key={v._id}>
                                            <td><span style={{ background: "#eff4ff", color: "#00236f", fontWeight: 700, fontSize: 12, padding: "3px 8px", borderRadius: 6 }}>{v.code}</span></td>
                                            <td><strong>{v.discount_type === "PERCENTAGE" ? `${v.discount_value}%` : fmtPrice(v.discount_value)}</strong></td>
                                            <td>{fmtPrice(v.max_discount_amount)}</td>
                                            <td>{fmtPrice(v.min_order_value)}</td>
                                            <td style={{ fontSize: 12 }}>{fmtDate(v.start_date)} – {fmtDate(v.end_date)}</td>
                                            <td><strong>{v.used_count}</strong>{v.usage_limit ? `/${v.usage_limit} lượt` : " lượt"}</td>
                                            <td><span className={`badge ${v.status === "ACTIVE" ? "badge-active" : "badge-inactive"}`}>{v.status === "ACTIVE" ? "Hoạt động" : "Ngừng hoạt động"}</span></td>
                                            <td>
                                                <div className="booking-action-cell">
                                                    <div className="booking-row-actions">
                                                        <button className="action-btn edit" onClick={() => openEditModal(v)}>Sửa</button>
                                                        <button className={`action-btn ${v.status === "ACTIVE" ? "complete" : "approve"}`} onClick={() => handleToggleStatus(v)}>{v.status === "ACTIVE" ? "Tạm ngưng" : "Kích hoạt"}</button>
                                                        <button className="action-btn cancel" onClick={() => handleDelete(v)}>Xóa</button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={8} style={{ textAlign: "center", padding: 24, color: "#6b7280" }}>Chưa có voucher nào</td></tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Modal Sửa Voucher ── */}
            {editing && (
                <div className="booking-modal-overlay" onClick={closeModal}>
                    <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="booking-modal-header">
                            <h3 className="booking-modal-title">Sửa Voucher</h3>
                            <button className="booking-modal-close" onClick={closeModal}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="booking-modal-body">
                            <form onSubmit={handleSave}>
                                <div className="form-group">
                                    <label className="form-label">Mã code *</label>
                                    <input type="text" className="form-input" value={fCode} onChange={(e) => setFCode(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Loại giảm giá *</label>
                                    <select className="form-input" value={fType} onChange={(e) => setFType(e.target.value as "PERCENTAGE" | "FIXED")}>
                                        <option value="PERCENTAGE">Phần trăm (%)</option>
                                        <option value="FIXED">Cố định (đ)</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Mức giảm *</label>
                                    <input type="text" className="form-input" value={fValue} onChange={(e) => setFValue(e.target.value)} placeholder="VD: 20 (nghĩa là 20%) hoặc 50000" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Đơn tối thiểu (đ)</label>
                                    <input type="text" className="form-input" value={fMinOrder} onChange={(e) => setFMinOrder(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Giảm tối đa (đ)</label>
                                    <input type="text" className="form-input" value={fMaxDiscount} onChange={(e) => setFMaxDiscount(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Ngày bắt đầu *</label>
                                    <input type="date" className="form-input" value={fStart} onChange={(e) => setFStart(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Ngày kết thúc *</label>
                                    <input type="date" className="form-input" value={fEnd} onChange={(e) => setFEnd(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Giới hạn lượt dùng</label>
                                    <input type="text" className="form-input" value={fUsageLimit} onChange={(e) => setFUsageLimit(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Trạng thái</label>
                                    <select className="form-input" value={fStatus} onChange={(e) => setFStatus(e.target.value)}>
                                        <option value="ACTIVE">Hoạt động</option>
                                        <option value="INACTIVE">Ngừng hoạt động</option>
                                    </select>
                                </div>
                                <div className="booking-modal-actions">
                                    <button type="button" className="action-btn cancel" onClick={closeModal} style={{ display: "inline-flex", justifyContent: "center", padding: "8px 14px", flex: 1, minWidth: 120, fontSize: 13, fontWeight: 700, borderRadius: 8 }}>
                                        Hủy
                                    </button>
                                    <button type="submit" className="btn-primary" disabled={saving} style={{ display: "inline-flex", justifyContent: "center", padding: "8px 14px", flex: 1, minWidth: 120, fontSize: 13, fontWeight: 700, borderRadius: 8 }}>
                                        {saving ? "Đang lưu..." : "Lưu thay đổi"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}