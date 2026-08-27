"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "../../page.css";
import { adminVoucherService, IVoucher } from "@/services/admin/voucherService";

export default function AddVoucherPage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);

    // Form state
    const [fCode, setFCode] = useState("");
    const [fType, setFType] = useState<"PERCENTAGE" | "FIXED">("PERCENTAGE");
    const [fValue, setFValue] = useState("");
    const [fMinOrder, setFMinOrder] = useState("");
    const [fMaxDiscount, setFMaxDiscount] = useState("");
    const [fStart, setFStart] = useState("");
    const [fEnd, setFEnd] = useState("");
    const [fUsageLimit, setFUsageLimit] = useState("");
    const [fStatus, setFStatus] = useState("ACTIVE");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fCode.trim() || !fValue.trim() || !fStart || !fEnd) {
            alert("Vui lòng điền đủ mã, mức giảm, ngày bắt đầu và kết thúc.");
            return;
        }
        if (new Date(fEnd) <= new Date(fStart)) {
            alert("Ngày kết thúc phải sau ngày bắt đầu.");
            return;
        }
        setSaving(true);
        try {
            const payload: Partial<IVoucher> = {
                code: fCode.trim().toUpperCase(),
                discount_type: fType,
                discount_value: Number(fValue.replace(/[^\d]/g, "")),
                min_order_value: Number(fMinOrder.replace(/[^\d]/g, "")) || 0,
                max_discount_amount: fMaxDiscount ? Number(fMaxDiscount.replace(/[^\d]/g, "")) : undefined,
                start_date: new Date(fStart).toISOString(),
                end_date: new Date(fEnd).toISOString(),
                usage_limit: fUsageLimit ? Number(fUsageLimit.replace(/[^\d]/g, "")) : undefined,
                status: fStatus,
                used_count: 0,
            };
            const res = await adminVoucherService.create(payload);
            if (res.success) {
                alert("Thêm voucher thành công!");
                router.push("/admin/vouchers");
            } else {
                alert(res.message || "Thêm voucher thất bại.");
            }
        } catch (err) {
            console.error(err);
            alert("Có lỗi xảy ra khi thêm voucher.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="admin-page-body" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh" }}>
            <div className="page-header-centered">
                <h1 className="admin-topbar-title" style={{ marginBottom: 8 }}>Thêm Voucher Mới</h1>
                <p style={{ color: "#6b7280", fontSize: 14 }}>Tạo chương trình ưu đãi và mã giảm giá mới cho hệ thống</p>
            </div>

            <div className="form-card" style={{ width: "100%", maxWidth: "600px" }}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Mã Code *</label>
                        <input
                            type="text"
                            className="form-input"
                            required
                            placeholder="Ví dụ: SUMMER50"
                            style={{ textTransform: "uppercase" }}
                            value={fCode}
                            onChange={(e) => setFCode(e.target.value)}
                        />
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
                        <input
                            type="text"
                            className="form-input"
                            required
                            placeholder={fType === "PERCENTAGE" ? "Ví dụ: 15 (nghĩa là 15%)" : "Ví dụ: 50000 (giảm 50.000đ)"}
                            value={fValue}
                            onChange={(e) => setFValue(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Đơn tối thiểu (đ)</label>
                        <input type="text" className="form-input" placeholder="Ví dụ: 200000" value={fMinOrder} onChange={(e) => setFMinOrder(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Giảm tối đa (đ)</label>
                        <input type="text" className="form-input" placeholder="Ví dụ: 50000" value={fMaxDiscount} onChange={(e) => setFMaxDiscount(e.target.value)} />
                    </div>

                    <div className="form-group flex" style={{ display: "flex", gap: "16px" }}>
                        <div style={{ flex: 1 }}>
                            <label className="form-label">Ngày bắt đầu *</label>
                            <input type="date" className="form-input" required value={fStart} onChange={(e) => setFStart(e.target.value)} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label className="form-label">Ngày kết thúc *</label>
                            <input type="date" className="form-input" required value={fEnd} onChange={(e) => setFEnd(e.target.value)} />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginTop: 20 }}>
                        <label className="form-label">Giới hạn lượt sử dụng</label>
                        <input type="number" className="form-input" placeholder="Ví dụ: 100" min="1" value={fUsageLimit} onChange={(e) => setFUsageLimit(e.target.value)} />
                    </div>

                    <div className="form-group" style={{ marginTop: 20 }}>
                        <label className="form-label">Trạng thái</label>
                        <select className="form-input" value={fStatus} onChange={(e) => setFStatus(e.target.value)}>
                            <option value="ACTIVE">Hoạt động</option>
                            <option value="INACTIVE">Ngừng hoạt động</option>
                        </select>
                    </div>

                    <div className="action-btns" style={{ marginTop: 24, justifyContent: "flex-end" }}>
                        <button type="button" className="action-btn cancel" onClick={() => router.push("/admin/vouchers")} style={{ padding: "12px 24px", borderRadius: 8, fontSize: 14 }}>
                            Hủy bỏ
                        </button>
                        <button type="submit" className="btn-primary" disabled={saving} style={{ padding: "12px 24px", borderRadius: 8 }}>
                            <span className="material-symbols-outlined">save</span> {saving ? "Đang lưu..." : "Lưu Voucher"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
