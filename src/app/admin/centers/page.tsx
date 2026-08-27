"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { adminCenterService } from "@/services/admin/centerService";
import { ISportCenter, ISport } from "@/interface/sportCenter";
import { useAuth } from "@/context/AuthContext";
import "../page.css";
import { API_BASE_URL } from "@/config/env";

interface ICourtMini {
  _id: string;
  court_name: string;
  price: number;
  peak_price?: number;
  status: string;
  total_bookings?: number;
}

export default function CentersPage() {
  const { user } = useAuth();
  const [centers, setCenters] = useState<ISportCenter[]>([]);
  const [sports, setSports] = useState<ISport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [search, setSearch] = useState<string>("");
  const [sportFilter, setSportFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("newest");

  // State cho modal chi tiết + danh sách sân con
  const [selectedCenter, setSelectedCenter] = useState<ISportCenter | null>(null);
  const [centerCourts, setCenterCourts] = useState<ICourtMini[]>([]);
  const [courtsLoading, setCourtsLoading] = useState<boolean>(false);

  // Fetch môn thể thao & cụm sân 
  const loadCenters = useCallback(async () => {
    setLoading(true);
    try {
      const [centerList, sportList] = await Promise.all([
        adminCenterService.getAll({ search, sport_id: sportFilter }),
        adminCenterService.getSports(),
      ]);
      setCenters(centerList);
      setSports(sportList);
    } catch (error) {
      console.error("Lỗi lấy danh sách cụm sân:", error);
    } finally {
      setLoading(false);
    }
  }, [search, sportFilter]);

  useEffect(() => {
    Promise.resolve().then(() => {
      loadCenters();
    });
  }, [loadCenters]);

  // Sắp xếp client
  const sortedCenters = [...centers].sort((a, b) => {
    if (sortOrder === "name-asc") return a.name.localeCompare(b.name, "vi");
    if (sortOrder === "name-desc") return b.name.localeCompare(a.name, "vi");
    if (sortOrder === "price-asc") return (a.default_price || 0) - (b.default_price || 0);
    if (sortOrder === "price-desc") return (b.default_price || 0) - (a.default_price || 0);
    // Mặc định "newest": cụm sân mới tạo hiển thị lên đầu cho admin dễ theo dõi
    const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
    const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
    return bTime - aTime;
  });

  // Mở modal chi tiết và fetch danh sách sân của cụm
  const handleViewDetail = async (center: ISportCenter) => {
    setSelectedCenter(center);
    setCenterCourts([]);
    setCourtsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/courts/sport-centers/${center._id}?includeInactive=true`);
      const data = await res.json();
      if (data.success) {
        setCenterCourts(data.data || []);
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách sân:", error);
    } finally {
      setCourtsLoading(false);
    }
  };

  // Xóa Cụm sân
  const handleDelete = async (id: string, name: string) => {
    if (confirm(
      `Bạn có chắc chắn muốn xóa cụm sân "${name}" không?\n\n` +
      `⚠️ Lưu ý: Nếu cụm sân còn đơn đặt sân đang hoạt động (chờ duyệt / đã duyệt / hoàn thành), hệ thống sẽ TỪ CHỐI xóa.\n` +
      `Cách an toàn: chuyển cụm sân sang trạng thái INACTIVE (tạm đóng) thay vì xóa.`
    )) {
      const res = await adminCenterService.delete(id);
      if (res.success) {
        alert("Đã xóa cụm sân thành công!");
        loadCenters();
      } else {
        alert(res.message || "Không thể xóa cụm sân!");
      }
    }
  };

  return (
    <>
      <header className="admin-topbar">
        <h1 className="admin-topbar-title">Quản lý Cụm sân</h1>
        <div className="admin-topbar-right">
          <span className="admin-topbar-role">{user?.name || user?.email}</span>
          <div className="admin-topbar-avatar">
            {(user?.name || user?.email || "A").charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      <div className="admin-page-body">
        <div className="page-header">
          <h3 className="table-card-title">Danh sách Cụm sân hoạt động</h3>
          <Link href="/admin/centers/add" className="btn-primary" style={{ textDecoration: "none" }}>
            <span className="material-symbols-outlined">add</span> Thêm Cụm sân
          </Link>
        </div>

        {/* Filter, Search, Sort Bar */}
        <div className="filter-search-container" style={{ marginBottom: 28, display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <div className="search-input-wrapper" style={{ flex: "5", minWidth: "200px" }}>
            <span className="material-symbols-outlined">search</span>
            <input
              type="text"
              className="search-field"
              placeholder="Tìm theo tên cụm sân, địa chỉ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div style={{ flex: "2.5", minWidth: "140px" }}>
            <select
              className="select-filter-field"
              value={sportFilter}
              onChange={(e) => setSportFilter(e.target.value)}
              style={{ height: "42px", width: "100%" }}
            >
              <option value="all">Tất cả môn thể thao</option>
              {sports.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div style={{ flex: "2.5", minWidth: "140px" }}>
            <select
              className="select-filter-field"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              style={{ height: "42px", width: "100%" }}
            >
              <option value="newest">Mới nhất</option>
              <option value="name-asc">Tên: A → Z</option>
              <option value="name-desc">Tên: Z → A</option>
              <option value="price-asc">Giá: Thấp → Cao</option>
              <option value="price-desc">Giá: Cao → Thấp</option>
            </select>
          </div>
        </div>

        <div className="table-card">
          <div className="table-scroll">
            <table className="owner-table">
              <thead>
                <tr>
                  <th>Hình ảnh</th>
                  <th>Tên cụm sân</th>
                  <th>Địa chỉ</th>
                  <th>Môn thể thao</th>
                  <th>Giá mặc định</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "24px", color: "#6b7280" }}>
                      Đang tải danh sách cụm sân...
                    </td>
                  </tr>
                ) : sortedCenters.length > 0 ? (
                  sortedCenters.map((c) => (
                    <tr key={c._id}>
                      <td>
                        <img
                          src={c.thumbnail || "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=100"}
                          alt={c.name}
                          style={{ width: 60, height: 40, objectFit: "cover", borderRadius: 6 }}
                        />
                      </td>
                      <td><strong>{c.name}</strong></td>
                      <td>{c.address}</td>
                      <td>
                        <span className="badge badge-sport">
                          {typeof c.sport_id === "object" ? c.sport_id?.name : "N/A"}
                        </span>
                      </td>
                      <td>{c.default_price ? `${c.default_price.toLocaleString()}đ` : "Miễn phí"}</td>
                      <td>
                        <span className={`badge ${c.status === "ACTIVE" ? "badge-active" : "badge-inactive"}`}>
                          {c.status === "ACTIVE" ? "Hoạt động" : "Tạm đóng"}
                        </span>
                      </td>
                      <td>
                        <div className="booking-action-cell">
                          <div className="action-btns">
                            <Link href={`/admin/centers/edit/${c._id}`} className="action-btn edit" style={{ textDecoration: "none" }}>
                              Sửa
                            </Link>
                            <button
                              className="action-btn cancel"
                              onClick={() => c._id && handleDelete(c._id, c.name)}
                            >
                              Xóa
                            </button>
                          </div>
                          <button className="booking-view-btn" onClick={() => handleViewDetail(c)}>
                            <span className="material-symbols-outlined">visibility</span>
                            Xem chi tiết
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "24px", color: "#6b7280" }}>
                      Không tìm thấy cụm sân nào phù hợp
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- Modal Xem Chi Tiết Cụm Sân --- */}
      {selectedCenter && (
        <div className="booking-modal-overlay" onClick={() => setSelectedCenter(null)}>
          <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
            <div className="booking-modal-header">
              <h3 className="booking-modal-title">Chi Tiết Cụm Sân</h3>
              <button className="booking-modal-close" onClick={() => setSelectedCenter(null)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="booking-modal-body">
              {(() => {
                const c = selectedCenter;
                const sportName = typeof c.sport_id === "object" ? c.sport_id?.name : "N/A";
                const isActive = c.status === "ACTIVE";

                return (
                  <>
                    {/* Trạng thái */}
                    <div className="booking-modal-status-row">
                      <div>
                        <span className="booking-modal-label">Tên cụm sân</span>
                        <div className="booking-modal-code">{c.name}</div>
                      </div>
                      <div className="booking-modal-badges">
                        <span className={`booking-badge ${isActive ? "status-completed" : "status-cancelled"}`}>
                          {isActive ? "Hoạt động" : "Tạm đóng"}
                        </span>
                      </div>
                    </div>

                    {/* Hình ảnh */}
                    {c.thumbnail && (
                      <div className="booking-modal-section" style={{ textAlign: "center" }}>
                        <img
                          src={c.thumbnail}
                          alt={c.name}
                          style={{ maxWidth: "100%", maxHeight: 220, objectFit: "cover", borderRadius: 12 }}
                        />
                      </div>
                    )}

                    {/* Thông tin chung */}
                    <div className="booking-modal-section">
                      <h4 className="booking-modal-section-title">
                        <span className="material-symbols-outlined">info</span>
                        Thông tin chung
                      </h4>
                      <div className="booking-modal-info-grid">
                        <div className="booking-modal-info-item">
                          <span className="booking-modal-info-label">Môn thể thao</span>
                          <span className="booking-modal-info-value">{sportName}</span>
                        </div>
                        <div className="booking-modal-info-item">
                          <span className="booking-modal-info-label">Giá mặc định</span>
                          <span className="booking-modal-info-value">
                            {c.default_price ? `${c.default_price.toLocaleString()}đ` : "Miễn phí"}
                          </span>
                        </div>
                        <div className="booking-modal-info-item">
                          <span className="booking-modal-info-label">Giờ mở cửa</span>
                          <span className="booking-modal-info-value">{c.opening_time || "—"}</span>
                        </div>
                        <div className="booking-modal-info-item">
                          <span className="booking-modal-info-label">Giờ đóng cửa</span>
                          <span className="booking-modal-info-value">{c.closing_time || "—"}</span>
                        </div>
                        {c.address && (
                          <div className="booking-modal-info-item full">
                            <span className="booking-modal-info-label">Địa chỉ</span>
                            <span className="booking-modal-info-value">{c.address}</span>
                          </div>
                        )}
                        {c.description && (
                          <div className="booking-modal-info-item full">
                            <span className="booking-modal-info-label">Mô tả</span>
                            <span className="booking-modal-info-value">{c.description}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Thống kê */}
                    <div className="booking-modal-section">
                      <h4 className="booking-modal-section-title">
                        <span className="material-symbols-outlined">monitoring</span>
                        Thống kê
                      </h4>
                      <div className="booking-modal-info-grid">
                        <div className="booking-modal-info-item">
                          <span className="booking-modal-info-label">Lượt xem</span>
                          <span className="booking-modal-info-value">{c.total_views ?? 0}</span>
                        </div>
                        <div className="booking-modal-info-item">
                          <span className="booking-modal-info-label">Lượt đặt</span>
                          <span className="booking-modal-info-value">{c.total_bookings ?? 0}</span>
                        </div>
                        <div className="booking-modal-info-item">
                          <span className="booking-modal-info-label">Đánh giá trung bình</span>
                          <span className="booking-modal-info-value">
                            {c.average_rating ? `${c.average_rating} ★` : "—"}
                          </span>
                        </div>
                        <div className="booking-modal-info-item">
                          <span className="booking-modal-info-label">Số đánh giá</span>
                          <span className="booking-modal-info-value">{c.total_reviews ?? 0}</span>
                        </div>
                      </div>
                    </div>

                    {/* Danh sách sân của cụm */}
                    <div className="booking-modal-section">
                      <h4 className="booking-modal-section-title">
                        <span className="material-symbols-outlined">stadium</span>
                        Danh sách sân ({centerCourts.length})
                      </h4>
                      {courtsLoading ? (
                        <p style={{ textAlign: "center", color: "#6b7280", padding: "12px" }}>
                          Đang tải danh sách sân...
                        </p>
                      ) : centerCourts.length > 0 ? (
                        <div className="booking-modal-table">
                          <table>
                            <thead>
                              <tr>
                                <th>Tên sân</th>
                                <th>Giá</th>
                                <th>Giá cao điểm</th>
                                <th>Trạng thái</th>
                              </tr>
                            </thead>
                            <tbody>
                              {centerCourts.map((court) => (
                                <tr key={court._id}>
                                  <td>{court.court_name || "—"}</td>
                                  <td>{court.price ? `${court.price.toLocaleString()}đ` : "—"}</td>
                                  <td>{court.peak_price ? `${court.peak_price.toLocaleString()}đ` : "—"}</td>
                                  <td>
                                    <span className={`badge ${court.status === "ACTIVE" ? "badge-active" : "badge-inactive"}`}>
                                      {court.status === "ACTIVE" ? "Hoạt động" : "Tạm đóng"}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p style={{ textAlign: "center", color: "#6b7280", padding: "12px" }}>
                          Cụm sân này chưa có sân nào.
                        </p>
                      )}
                    </div>

                    {/* Thao tác */}
                    <div className="booking-modal-actions">
                      <Link
                        href={`/admin/centers/edit/${c._id}`}
                        className="action-btn edit"
                        style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "8px 14px", flex: 1, minWidth: 120, fontSize: 13, fontWeight: 700, borderRadius: 8, border: "1px solid #93c5fd" }}
                      >
                        Sửa
                      </Link>
                      <button
                        className="action-btn cancel"
                        onClick={() => {
                          if (c._id) {
                            handleDelete(c._id, c.name);
                          }
                        }}
                        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "8px 14px", flex: 1, minWidth: 120, fontSize: 13, fontWeight: 700, borderRadius: 8, border: "1px solid #fca5a5" }}
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