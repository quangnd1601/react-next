"use client";

import { useRouter } from "next/navigation";
import "../../page.css";

export default function AddCenterPage() {
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Đã thêm cụm sân thành công!");
        router.push("/admin/centers");
    };

    return (
        <div className="admin-page-body" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh" }}>
            <div className="page-header-centered">
                <h1 className="admin-topbar-title" style={{ marginBottom: 8 }}>Thêm Cụm Sân Mới</h1>
                <p style={{ color: "#6b7280", fontSize: 14 }}>Nhập đầy đủ thông tin bên dưới để đăng ký cụm sân mới vào hệ thống</p>
            </div>

            <div className="form-card" style={{ width: "100%", maxWidth: "600px" }}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Tên cụm sân *</label>
                        <input type="text" className="form-input" required placeholder="Ví dụ: Cụm Sân Pickleball Thảo Điền" />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Địa chỉ *</label>
                        <input type="text" className="form-input" required placeholder="Ví dụ: 12 Quốc Hương, Thảo Điền, Quận 2" />
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
                        <label className="form-label">Số lượng sân *</label>
                        <input type="number" className="form-input" required placeholder="Ví dụ: 5" min="1" />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Hình ảnh đại diện (Thumbnail)</label>
                        <input type="file" className="form-input form-input-file" accept="image/*" />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Mô tả cụm sân</label>
                        <textarea className="form-input" rows={4} placeholder="Nhập thông tin giới thiệu cụm sân..." style={{ resize: "vertical" }}></textarea>
                    </div>

                    <div className="action-btns" style={{ marginTop: 24, justifyContent: "flex-end" }}>
                        <button type="button" className="action-btn cancel" onClick={() => router.push("/admin/centers")} style={{ padding: "12px 24px", borderRadius: 8, fontSize: 14 }}>
                            Hủy bỏ
                        </button>
                        <button type="submit" className="btn-primary" style={{ padding: "12px 24px", borderRadius: 8 }}>
                            <span className="material-symbols-outlined">save</span> Lưu cụm sân
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
