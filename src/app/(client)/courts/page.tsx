"use client";

import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { clientCourtService } from "@/services/client/courtService";
import { ISportCenter, ISport } from "@/interface/sportCenter";
import "./page.css";

function CourtContent() {
  const searchParams = useSearchParams();

  const [centers, setCenters] = useState<ISportCenter[]>([]);
  const [sports, setSports] = useState<ISport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // States cho Bộ lọc
  const [locationSearch, setLocationSearch] = useState<string>("");
  const [selectedSport, setSelectedSport] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("newest");

  // Đọc query params từ Banner (tìm kiếm trên trang chủ)
  const urlSearch = searchParams.get("search") || "";
  const urlSport = searchParams.get("sport") || "";
  const urlDate = searchParams.get("date") || "";

  // Nếu URL có param lọc (search/sport) thì BỎ QUA lần fetch đầu tiên,
  // tránh race "tải tất cả" ghi đè lên kết quả đã lọc (sẽ fetch đúng filter sau khi pre-fill)
  const skipFirstFetchRef = useRef(urlSearch || urlSport ? true : false);

  // Load danh sách môn thể thao + pre-fill bộ lọc từ URL
  // Chạy lại khi URL đổi (vd: dùng ngay ô tìm kiếm nav khi đang ở trang này)
  useEffect(() => {
    // Pre-fill tìm kiếm địa điểm/tên từ query
    setLocationSearch(urlSearch || "");
    // Load môn thể thao + chọn môn từ query (ví dụ sport=tennis)
    clientCourtService.getSports().then((data) => {
      setSports(data);
      if (urlSport) {
        const matched = data.find(
          (s) => s.name.toLowerCase() === urlSport.toLowerCase()
        );
        if (matched) setSelectedSport(matched._id);
      } else {
        setSelectedSport("");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlSearch, urlSport]);

  // Fetch danh sách cụm sân từ API
  const fetchCenters = useCallback(async () => {
    setLoading(true);
    try {
      let backendSort = "bookings_desc";
      if (sortOption === "newest") backendSort = "newest";
      if (sortOption === "price-low") backendSort = "price_asc";
      if (sortOption === "price-high") backendSort = "price_desc";

      const data = await clientCourtService.getCentersList({
        search: locationSearch,
        sport_id: selectedSport,
        min_price: minPrice,
        max_price: maxPrice,
        sort: backendSort,
      });

      setCenters(data);
    } catch (error) {
      console.error("Lỗi tải danh sách sân:", error);
    } finally {
      setLoading(false);
    }
  }, [locationSearch, selectedSport, minPrice, maxPrice, sortOption]);

  // load danh sách cụm sân khi trang tải hoặc bộ lọc/sắp xếp thay đổi
  useEffect(() => {
    // Nếu URL có param lọc: bỏ qua lần fetch này, lần fetch đúng filter
    // sẽ diễn ra ngay sau khi pre-fill (locationSearch/sport) được set.
    if (skipFirstFetchRef.current) {
      skipFirstFetchRef.current = false;
      return;
    }
    Promise.resolve().then(() => fetchCenters());
  }, [fetchCenters]);

  // Nút xóa tất cả bộ lọc
  const handleClearFilters = () => {
    setLocationSearch("");
    setSelectedSport("");
    setMinPrice("");
    setMaxPrice("");
    setSortOption("newest");
  };

  return (
    <main className="search-page-shell">
      {/* Breadcrumbs */}
      <nav className="breadcrumbs">
        <Link href="/">Trang chủ</Link>
        <span className="material-symbols-outlined">chevron_right</span>
        <span className="active">Tìm sân</span>
      </nav>

      <div className="search-layout">
        {/* Bộ Lọc (Aside) */}
        <aside className="filters-panel">
          <div className="panel-header">
            <h3>
              <span className="material-symbols-outlined">filter_list</span> Bộ lọc
            </h3>
            <button id="clear-filters-btn" type="button" onClick={handleClearFilters}>
              Xóa tất cả
            </button>
          </div>

          {/* Địa điểm / Tên sân */}
          <div className="filter-group">
            <label>Địa điểm / Tên cụm sân</label>
            <div className="input-wrap">
              <span className="material-symbols-outlined">location_on</span>
              <input
                id="filter-location"
                type="text"
                placeholder="Nhập tên cụm sân, thành phố, quận..."
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Danh mục môn thể thao */}
          <div className="filter-group">
            <label>Danh mục môn thể thao</label>
            <select
              id="filter-sport"
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
            >
              <option value="">Tất cả môn thể thao</option>
              {sports.map((sport) => (
                <option key={sport._id} value={sport._id}>
                  {sport.name}
                </option>
              ))}
            </select>
          </div>

          {/* Khoảng giá */}
          <div className="filter-group">
            <label>Giá cả (đ/giờ)</label>
            <div className="price-row">
              <input
                id="filter-price-min"
                type="number"
                placeholder="Từ"
                min="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <input
                id="filter-price-max"
                type="number"
                placeholder="Đến"
                min="0"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>

          <button
            id="apply-filters-btn"
            className="apply-btn"
            type="button"
            onClick={fetchCenters}
          >
            <span className="material-symbols-outlined">search</span> Lọc Sân
          </button>
        </aside>

        {/* Danh sách kết quả (Section) */}
        <section className="results-panel">
          <div className="toolbar">
            <div className="results-count">
              Tìm thấy <span id="results-count">{centers.length}</span> cụm sân phù hợp.
              {urlDate && (
                <span style={{ fontSize: 12, marginLeft: 8, color: "#6b7280" }}>
                  • Ngày đặt: {urlDate}
                </span>
              )}
            </div>
            <div className="sort-box">
              <label>Sắp xếp</label>
              <select
                id="sort-select"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="most-booked">Đặt nhiều nhất</option>
                <option value="newest">Mới nhất</option>
                <option value="price-low">Giá: Thấp - Cao</option>
                <option value="price-high">Giá: Cao - Thấp</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#00236f" }}>
              Đang tìm kiếm cụm sân...
            </div>
          ) : centers.length > 0 ? (
            <div id="search-results-list" className="results-stack">
              {centers.map((court) => {
                const sportName = typeof court.sport_id === "object" ? court.sport_id?.name : "Thể thao";
                const price = court.default_price || 80000;
                const rating = court.average_rating ? court.average_rating.toFixed(1) : "—";
                const bookings = court.total_bookings || 0;

                return (
                  <article className="court-card horizontal-card" key={court._id}>
                    <div className="court-image-box">
                      <img
                        src={court.thumbnail || "https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=900"}
                        alt={court.name}
                      />
                      <div className="image-badge sport-badge">{sportName}</div>
                      <div className="image-badge booking-badge">
                        <span className="material-symbols-outlined">local_fire_department</span>
                        {bookings} lượt đặt
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="card-top">
                        <h4>{court.name}</h4>
                        <div className="rating">
                          <span className="material-symbols-outlined">star</span>
                          <span>{rating}</span>
                        </div>
                      </div>
                      <p className="address">
                        <span className="material-symbols-outlined">location_on</span>
                        {court.address}
                      </p>
                      <div className="card-meta">
                        <span>Gửi xe miễn phí</span>
                        <span>Điều hòa</span>
                        <span>Căng tin</span>
                      </div>
                      <div className="card-footer">
                        <span className="price">
                          Từ {price.toLocaleString("vi-VN")}đ<span>/giờ</span>
                        </span>
                        <div className="card-actions">
                          <Link href={`/courts/${court._id}`} className="btn-book">
                            ĐẶT SÂN
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#6b7280" }}>
              Không tìm thấy cụm sân nào phù hợp với bộ lọc.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default function CourtPage() {
  return (
    <Suspense fallback={<div style={{ padding: "50px", textAlign: "center" }}>Đang tải...</div>}>
      <CourtContent />
    </Suspense>
  );
}