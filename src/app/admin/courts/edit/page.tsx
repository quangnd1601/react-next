"use client";

import { useRouter } from "next/navigation";
import "../../page.css";

export default function EditCourtPage() {
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Đã lưu thay đổi thông tin sân thành công!");
        router.push("/admin/courts");
    };

    return (
        <div className="admin-page-body" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh" }}>
            <div className="page-header-centered">
                <h1 className="admin-topbar-title" style={{ marginBottom: 8 }}>Chỉnh Sửa Thông Tin Sân</h1>
                <p style={{ color: "#6b7280", fontSize: 14 }}>Thay đổi các thông tin chi tiết của sân bóng đang chọn</p>
            </div>

            <div className="form-card" style={{ width: "100%", maxWidth: "600px" }}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Thuộc Cụm sân *</label>
                        <select className="form-input" required defaultValue="1">
                            <option value="1">Cụm Sân Pickleball Thảo Điền</option>
                            <option value="2">Cụm Sân Tennis Kỳ Hòa</option>
                            <option value="3">Trung Tâm Cầu Lông Sunrise</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Tên sân *</label>
                        <input type="text" className="form-input" required defaultValue="Sân 03" />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Môn thể thao *</label>
                        <select className="form-input" required defaultValue="pickleball">
                            <option value="pickleball">Pickleball</option>
                            <option value="tennis">Tennis</option>
                            <option value="badminton">Cầu lông</option>
                            <option value="football">Bóng đá</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Giá thuê mỗi giờ *</label>
                        <input type="text" className="form-input" required defaultValue="150.000đ/giờ" />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Hình ảnh đại diện sân (Thumbnail)</label>
                        <input type="file" className="form-input form-input-file" accept="image/*" />
                        <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>Chọn tệp mới nếu muốn thay thế ảnh hiện tại</p>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Trạng thái sân</label>
                        <select className="form-input" defaultValue="active">
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
                            <span className="material-symbols-outlined">save</span> Lưu thay đổi
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
