"use client";

import { useRouter } from "next/navigation";
import "../../page.css";

export default function AddVoucherPage() {
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Đã thêm voucher mới thành công!");
        router.push("/admin/vouchers");
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
                        <input type="text" className="form-input" required placeholder="Ví dụ: SUMMER50" style={{ textTransform: "uppercase" }} />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Mô tả chương trình *</label>
                        <input type="text" className="form-input" required placeholder="Ví dụ: Khuyến mãi giảm giá chào hè" />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Mức giảm (%) *</label>
                        <input type="number" className="form-input" required placeholder="Ví dụ: 15" min="1" max="100" />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Giảm tối đa *</label>
                        <input type="text" className="form-input" required placeholder="Ví dụ: 50.000đ" />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Đơn hàng tối thiểu *</label>
                        <input type="text" className="form-input" required placeholder="Ví dụ: 200.000đ" />
                    </div>

                    <div className="form-group flex" style={{ display: "flex", gap: "16px" }}>
                        <div style={{ flex: 1 }}>
                            <label className="form-label">Ngày bắt đầu *</label>
                            <input type="date" className="form-input" required />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label className="form-label">Ngày kết thúc *</label>
                            <input type="date" className="form-input" required />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginTop: 20 }}>
                        <label className="form-label">Giới hạn lượt sử dụng *</label>
                        <input type="number" className="form-input" required placeholder="Ví dụ: 100" min="1" />
                    </div>

                    <div className="action-btns" style={{ marginTop: 24, justifyContent: "flex-end" }}>
                        <button type="button" className="action-btn cancel" onClick={() => router.push("/admin/vouchers")} style={{ padding: "12px 24px", borderRadius: 8, fontSize: 14 }}>
                            Hủy bỏ
                        </button>
                        <button type="submit" className="btn-primary" style={{ padding: "12px 24px", borderRadius: 8 }}>
                            <span className="material-symbols-outlined">save</span> Lưu Voucher
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
