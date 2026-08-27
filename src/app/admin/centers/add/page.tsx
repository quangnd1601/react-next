"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminCenterService } from "@/services/admin/centerService";
import { uploadSingleImage } from "@/services/uploadService";
import { ISport } from "@/interface/sportCenter";
import { useAuth } from "@/context/AuthContext";
import "@/app/admin/page.css";

export default function AddCenterPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [sportId, setSportId] = useState("");
  const [defaultPrice, setDefaultPrice] = useState<number>(100000);
  const [openingTime, setOpeningTime] = useState("06:00");
  const [closingTime, setClosingTime] = useState("23:00");
  const [description, setDescription] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  
  const [sports, setSports] = useState<ISport[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    adminCenterService.getSports().then((data) => {
      setSports(data);
      if (data.length > 0) setSportId(data[0]._id);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !address || !sportId) {
      alert("Vui lòng điền đầy đủ các thông tin bắt buộc!");
      return;
    }

    setLoading(true);

    try {
      let thumbnailUrl = "";
      if (thumbnailFile) {
        const uploadRes = await uploadSingleImage(thumbnailFile);
        if (uploadRes.success && uploadRes.url) {
          thumbnailUrl = uploadRes.url;
        } else {
          alert("Lỗi upload ảnh lên Cloudinary: " + (uploadRes.message || "Không xác định"));
          setLoading(false);
          return;
        }
      }

      const res = await adminCenterService.create({
        owner_id: user?._id,
        name,
        address,
        sport_id: sportId,
        default_price: Number(defaultPrice),
        opening_time: openingTime,
        closing_time: closingTime,
        description,
        thumbnail: thumbnailUrl || "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800",
        status: "ACTIVE",
      });

      if (res.success) {
        alert("Đã thêm cụm sân mới thành công!");
        router.push("/admin/centers");
      } else {
        alert(res.message || "Thêm cụm sân thất bại!");
      }
    } catch (error) {
      console.error("Lỗi thêm cụm sân:", error);
      alert("Đã xảy ra lỗi khi thêm cụm sân!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page-body" style={{ display: "flex", flexDirection: "column", alignItems: "center", minHeight: "80vh" }}>
      <div className="page-header-centered">
        <h1 className="admin-topbar-title" style={{ marginBottom: 8 }}>Thêm Cụm Sân Mới</h1>
        <p style={{ color: "#6b7280", fontSize: 14 }}>Nhập đầy đủ thông tin bên dưới để đăng ký cụm sân mới vào hệ thống</p>
      </div>

      <div className="form-card" style={{ width: "100%", maxWidth: "600px" }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Tên cụm sân *</label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="Ví dụ: Cụm Sân Pickleball Thảo Điền"
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
              placeholder="Ví dụ: 12 Quốc Hương, Thảo Điền, Quận 2"
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
                min="0"
              />
            </div>
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
            <input
              type="file"
              className="form-input form-input-file"
              accept="image/*"
              onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mô tả cụm sân</label>
            <textarea
              className="form-input"
              rows={4}
              placeholder="Nhập thông tin giới thiệu cụm sân..."
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
              disabled={loading}
            >
              <span className="material-symbols-outlined">save</span>
              {loading ? "Đang lưu..." : "Lưu cụm sân"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
