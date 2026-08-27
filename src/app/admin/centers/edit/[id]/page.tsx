"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { adminCenterService } from "@/services/admin/centerService";
import { uploadSingleImage } from "@/services/uploadService";
import { ISport } from "@/interface/sportCenter";
import "@/app/admin/page.css";

export default function EditCenterPage() {
  const router = useRouter();
  const params = useParams();
  const centerId = params.id as string;

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [sportId, setSportId] = useState("");
  const [defaultPrice, setDefaultPrice] = useState<number>(100000);
  const [openingTime, setOpeningTime] = useState("06:00");
  const [closingTime, setClosingTime] = useState("23:00");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");
  const [currentThumbnail, setCurrentThumbnail] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const [sports, setSports] = useState<ISport[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!centerId) return;
      try {
        const [sportList, centerData] = await Promise.all([
          adminCenterService.getSports(),
          adminCenterService.getById(centerId),
        ]);

        setSports(sportList);

        if (centerData) {
          setName(centerData.name || "");
          setAddress(centerData.address || "");
          setSportId(
            typeof centerData.sport_id === "object" && centerData.sport_id !== null
              ? centerData.sport_id._id
              : (centerData.sport_id as string) || ""
          );
          setDefaultPrice(centerData.default_price || 0);
          setOpeningTime(centerData.opening_time || "06:00");
          setClosingTime(centerData.closing_time || "23:00");
          setDescription(centerData.description || "");
          setStatus(centerData.status || "ACTIVE");
          setCurrentThumbnail(centerData.thumbnail || "");
        }
      } catch (error) {
        console.error("Lỗi lấy dữ liệu cụm sân:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [centerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !address || !sportId) {
      alert("Vui lòng điền đầy đủ các thông tin bắt buộc!");
      return;
    }

    setSaving(true);

    try {
      let thumbnailUrl = currentThumbnail;
      if (thumbnailFile) {
        const uploadRes = await uploadSingleImage(thumbnailFile);
        if (uploadRes.success && uploadRes.url) {
          thumbnailUrl = uploadRes.url;
        } else {
          alert("Lỗi upload ảnh lên Cloudinary: " + (uploadRes.message || "Không xác định"));
          setSaving(false);
          return;
        }
      }

      const res = await adminCenterService.update(centerId, {
        name,
        address,
        sport_id: sportId,
        default_price: Number(defaultPrice),
        opening_time: openingTime,
        closing_time: closingTime,
        description,
        status,
        thumbnail: thumbnailUrl,
      });

      if (res.success) {
        alert("Đã cập nhật cụm sân thành công!");
        router.push("/admin/centers");
      } else {
        alert(res.message || "Cập nhật thất bại!");
      }
    } catch (error) {
      console.error("Lỗi cập nhật cụm sân:", error);
      alert("Đã xảy ra lỗi khi cập nhật!");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page-body" style={{ textAlign: "center", padding: "40px" }}>
        Đang tải dữ liệu cụm sân...
      </div>
    );
  }

  return (
    <div className="admin-page-body" style={{ display: "flex", flexDirection: "column", alignItems: "center", minHeight: "80vh" }}>
      <div className="page-header-centered">
        <h1 className="admin-topbar-title" style={{ marginBottom: 8 }}>Chỉnh Sửa Cụm Sân</h1>
        <p style={{ color: "#6b7280", fontSize: 14 }}>Thay đổi các thông tin chi tiết của cụm sân đang chọn</p>
      </div>

      <div className="form-card" style={{ width: "100%", maxWidth: "600px" }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Tên cụm sân *</label>
            <input
              type="text"
              className="form-input"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Địa chỉ *</label>
            <input
              type="text"
              className="form-input"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Môn thể thao *</label>
            <select
              className="form-input"
              required
              value={sportId}
              onChange={(e) => setSportId(e.target.value)}
            >
              <option value="">-- Chọn môn --</option>
              {sports.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ display: "flex", gap: "16px" }}>
            <div style={{ flex: 1 }}>
              <label className="form-label">Giá mặc định (VNĐ) *</label>
              <input
                type="number"
                className="form-input"
                required
                value={defaultPrice}
                onChange={(e) => setDefaultPrice(Number(e.target.value))}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label className="form-label">Trạng thái</label>
              <select
                className="form-input"
                value={status}
                onChange={(e) => setStatus(e.target.value as "ACTIVE" | "INACTIVE")}
              >
                <option value="ACTIVE">Hoạt động</option>
                <option value="INACTIVE">Tạm đóng</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ display: "flex", gap: "16px" }}>
            <div style={{ flex: 1 }}>
              <label className="form-label">Giờ mở cửa</label>
              <input
                type="time"
                className="form-input"
                value={openingTime}
                onChange={(e) => setOpeningTime(e.target.value)}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label className="form-label">Giờ đóng cửa</label>
              <input
                type="time"
                className="form-input"
                value={closingTime}
                onChange={(e) => setClosingTime(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Hình ảnh đại diện (Thumbnail)</label>
            <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "12px" }}>
              {currentThumbnail && (
                <div>
                  <span style={{ fontSize: "12px", color: "#6b7280", display: "block", marginBottom: "4px" }}>Ảnh hiện tại:</span>
                  <img
                    src={currentThumbnail}
                    alt="Thumbnail hiện tại"
                    style={{ width: 120, height: 75, objectFit: "cover", borderRadius: 8, border: "1px solid #e5e7eb" }}
                  />
                </div>
              )}

              {thumbnailFile && (
                <div>
                  <span style={{ fontSize: "12px", color: "#2563eb", display: "block", marginBottom: "4px", fontWeight: 600 }}>Ảnh mới chọn (Xem trước):</span>
                  <img
                    src={URL.createObjectURL(thumbnailFile)}
                    alt="Xem trước ảnh mới"
                    style={{ width: 120, height: 75, objectFit: "cover", borderRadius: 8, border: "2px solid #2563eb" }}
                  />
                </div>
              )}
            </div>

            <input
              type="file"
              className="form-input form-input-file"
              accept="image/*"
              onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
            />
            <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
              Chọn tệp ảnh mới từ máy tính nếu muốn thay thế hình ảnh hiện tại
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">Mô tả cụm sân</label>
            <textarea
              className="form-input"
              rows={4}
              style={{ resize: "vertical" }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="action-btns" style={{ marginTop: 24, justifyContent: "flex-end" }}>
            <button
              type="button"
              className="action-btn cancel"
              onClick={() => router.push("/admin/centers")}
              style={{ padding: "12px 24px", borderRadius: 8, fontSize: 14 }}
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ padding: "12px 24px", borderRadius: 8 }}
              disabled={saving}
            >
              <span className="material-symbols-outlined">save</span>
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
