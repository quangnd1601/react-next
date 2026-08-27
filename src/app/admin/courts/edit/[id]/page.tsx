"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { adminCourtService } from "@/services/admin/courtService";
import { adminCenterService } from "@/services/admin/centerService";
import { ISportCenter } from "@/interface/sportCenter";
import "../../../page.css";
import { API_BASE_URL } from "@/config/env";

export default function EditCourtPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const courtId = params?.id;

    const [centers, setCenters] = useState<ISportCenter[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    // Form state
    const [sportCenterId, setSportCenterId] = useState("");
    const [courtName, setCourtName] = useState("");
    const [price, setPrice] = useState("");
    const [peakPrice, setPeakPrice] = useState("");
    const [status, setStatus] = useState("ACTIVE");
    const [submitting, setSubmitting] = useState(false);

    // Upload ảnh
    const [thumbnail, setThumbnail] = useState("");
    const [thumbnailPreview, setThumbnailPreview] = useState("");
    const [uploading, setUploading] = useState(false);

    const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Preview trước
        setThumbnailPreview(URL.createObjectURL(file));
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("image", file);
            formData.append("folder", "courtify/courts");
            const res = await fetch(`${API_BASE_URL}/upload/single`, {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.success) {
                setThumbnail(data.url);
            } else {
                alert(data.message || "Upload ảnh thất bại.");
                setThumbnailPreview("");
            }
        } catch (err) {
            console.error(err);
            alert("Có lỗi xảy ra khi upload ảnh.");
            setThumbnailPreview("");
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        Promise.resolve().then(async () => {
            if (!courtId) return;
            try {
                const [courtData, centerList] = await Promise.all([
                    adminCourtService.getById(courtId),
                    adminCenterService.getAll(),
                ]);
                setCenters(centerList);

                if (courtData) {
                    setSportCenterId(
                        typeof courtData.sport_center_id === "object" && courtData.sport_center_id
                            ? courtData.sport_center_id._id
                            : String(courtData.sport_center_id)
                    );
                    setCourtName(courtData.court_name || "");
                    setPrice(courtData.price ? String(courtData.price) : "");
                    setPeakPrice(courtData.peak_price ? String(courtData.peak_price) : "");
                    setStatus(courtData.status || "ACTIVE");
                    setThumbnail(courtData.thumbnail || "");
                    setThumbnailPreview(courtData.thumbnail || "");
                }
            } catch (err) {
                console.error("Lỗi lấy dữ liệu sân:", err);
                alert("Lỗi lấy dữ liệu sân.");
            } finally {
                setLoadingData(false);
            }
        });
    }, [courtId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!courtId) {
            alert("Thiếu ID sân.");
            return;
        }
        if (!sportCenterId || !courtName.trim() || !price.trim()) {
            alert("Vui lòng điền đủ các trường bắt buộc (Cụm sân, Tên sân, Giá).");
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                sport_center_id: sportCenterId,
                court_name: courtName.trim(),
                price: Number(price.replace(/[^\d]/g, "")),
                peak_price: peakPrice ? Number(peakPrice.replace(/[^\d]/g, "")) : undefined,
                status,
                thumbnail: thumbnail || undefined,
            };
            const res = await adminCourtService.update(courtId, payload);
            if (res.success) {
                alert("Đã lưu thay đổi thông tin sân thành công!");
                router.push("/admin/courts");
            } else {
                alert(res.message || "Không thể cập nhật sân!");
            }
        } catch (err) {
            console.error(err);
            alert("Có lỗi xảy ra khi cập nhật sân.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loadingData) {
        return (
            <div className="admin-page-body" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh" }}>
                <div className="page-header-centered">
                    <h1 className="admin-topbar-title">Chỉnh Sửa Thông Tin Sân</h1>
                    <p style={{ color: "#6b7280", fontSize: 14, marginTop: 8 }}>Đang tải thông tin sân...</p>
                </div>
            </div>
        );
    }

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
                        <select className="form-input" required value={sportCenterId} onChange={(e) => setSportCenterId(e.target.value)}>
                            <option value="">-- Chọn cụm sân --</option>
                            {centers.map((c) => (
                                <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Tên sân *</label>
                        <input type="text" className="form-input" required placeholder="Ví dụ: Sân 04" value={courtName} onChange={(e) => setCourtName(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Giá thuê mỗi giờ (VND) *</label>
                        <input type="text" className="form-input" required placeholder="Ví dụ: 150000" value={price} onChange={(e) => setPrice(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Giá cao điểm (VND)</label>
                        <input type="text" className="form-input" placeholder="Ví dụ: 220000" value={peakPrice} onChange={(e) => setPeakPrice(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Hình ảnh đại diện sân (Thumbnail)</label>
                        <input
                            type="file"
                            className="form-input form-input-file"
                            accept="image/*"
                            onChange={handleUploadImage}
                        />
                        <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>Chọn tệp mới nếu muốn thay thế ảnh hiện tại</p>
                        {(thumbnailPreview || thumbnail) && (
                            <div style={{ marginTop: 8 }}>
                                <img
                                    src={thumbnailPreview || thumbnail}
                                    alt="Preview"
                                    style={{ maxWidth: "100%", maxHeight: 160, objectFit: "cover", borderRadius: 8 }}
                                />
                            </div>
                        )}
                        {uploading && (
                            <p style={{ fontSize: 12, color: "#6b7280" }}>Đang upload ảnh...</p>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Trạng thái sân</label>
                        <select className="form-input" value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="ACTIVE">Hoạt động</option>
                            <option value="MAINTENANCE">Bảo trì</option>
                            <option value="INACTIVE">Tạm đóng</option>
                        </select>
                    </div>

                    <div className="action-btns" style={{ marginTop: 24, justifyContent: "flex-end" }}>
                        <button type="button" className="action-btn cancel" onClick={() => router.push("/admin/courts")} style={{ padding: "12px 24px", borderRadius: 8, fontSize: 14 }}>
                            Hủy bỏ
                        </button>
                        <button type="submit" className="btn-primary" style={{ padding: "12px 24px", borderRadius: 8 }} disabled={submitting}>
                            <span className="material-symbols-outlined">save</span> {submitting ? "Đang lưu..." : "Lưu thay đổi"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}