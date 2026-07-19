"use client";

import { useRouter } from "next/navigation";
import "../../page.css";

export default function AddCourtPage() {
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Đã thêm sân mới thành công!");
        router.push("/admin/courts");
    };

    return (
        <div className="admin-page-body" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh" }}>
            <div className="page-header-centered">
                <h1 className="admin-topbar-title" style={{ marginBottom: 8 }}>Thêm Sân Mới</h1>
                <p style={{ color: "#6b7280", fontSize: 14 }}>Thiết lập cấu hình và gán sân hoạt động vào cụm sân quản lý tương ứng</p>
            </div>

            <div className="form-card" style={{ width: "100%", maxWidth: "600px" }}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Thuộc Cụm sân *</label>
                        <select className="form-input" required>
                            <option value="">-- Chọn cụm sân --</option>
                            <option value="1">Cụm Sân Pickleball Thảo Điền</option>
                            <option value="2">Cụm Sân Tennis Kỳ Hòa</option>
                            <option value="3">Trung Tâm Cầu Lông Sunrise</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Tên sân *</label>
                        <input type="text" className="form-input" required placeholder="Ví dụ: Sân 04" />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Môn thể thao *</label>
                        <select className="form-input" required>
                            <option value="">-- Chọn môn --</option>
                            <option value="pickleball">Pickleball</option>
                            <option value="tennis">Tennis</option>
                            <option value="badminton">Cầu lông</option>
                            <option value="football">Bóng đá</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Giá thuê mỗi giờ *</label>
                        <input type="text" className="form-input" required placeholder="Ví dụ: 150.000đ/giờ" />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Hình ảnh đại diện sân (Thumbnail)</label>
                        <input type="file" className="form-input form-input-file" accept="image/*" />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Trạng thái sân</label>
                        <select className="form-input">
                            <option value="active">Hoạt động</option>
                            <option value="maintenance">Bảo trì</option>
                            <option value="inactive">Tạm đóng</option>
                        </select>
                    </div>

                    <div className="action-btns" style={{ marginTop: 24, justifyContent: "flex-end" }}>
                        <button type="button" className="action-btn cancel" onClick={() => router.push("/admin/courts")} style={{ padding: "12px 24px", borderRadius: 8, fontSize: 14 }}>
                            Hủy bỏ
                        </button>
                        <button type="submit" className="btn-primary" style={{ padding: "12px 24px", borderRadius: 8 }}>
                            <span className="material-symbols-outlined">save</span> Lưu sân mới
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
