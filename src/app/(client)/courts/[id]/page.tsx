"use client";

import { useEffect, useState, use, useMemo, useCallback } from "react";
import Link from "next/link";
import { ISportCenter } from "@/interface/sportCenter";
import { clientCourtService, ICourtDetail, ITimeSlot, IBookedSlot } from "@/services/client/courtService";

export default function CourtDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const centerId = resolvedParams.id;

  const [courtCenter, setCourtCenter] = useState<ISportCenter | null>(null);
  const [courts, setCourts] = useState<ICourtDetail[]>([]);
  const [timeSlots, setTimeSlots] = useState<ITimeSlot[]>([]);
  const [bookedSlots, setBookedSlots] = useState<IBookedSlot[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  // Lưu các lựa chọn dạng "court_id:time_slot_id" => cho phép đặt nhiều sân + nhiều khung giờ
  const [selectedPairs, setSelectedPairs] = useState<Set<string>>(new Set());
  // Sân đang được chọn để hiển thị khung giờ (giữ nguyên UI cũ: chọn sân nào show sân đó)
  const [selectedCourtId, setSelectedCourtId] = useState<string>("");
  // Ảnh đang hiển thị trên khung ảnh chính (mặc định là ảnh CỤM SÂN; bấm ảnh sân phía dưới để đổi)
  const [activeImage, setActiveImage] = useState<string | null>(null);

  // Giá mặc định (phụ thuộc courtCenter, có thể null lúc đầu render)
  const defaultPrice = courtCenter?.default_price || 80000;

  // 1. Tải thông tin Cụm sân & Danh sách Sân chi tiết & Danh sách TimeSlot qua clientCourtService
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [centerData, courtsData, slotsData] = await Promise.all([
          clientCourtService.getCenterDetail(centerId),
          clientCourtService.getCourtsByCenter(centerId),
          clientCourtService.getAllTimeSlots(),
        ]);

        if (centerData) setCourtCenter(centerData);
        if (courtsData) {
          setCourts(courtsData);
          // Tự chọn sân ĐANG HOẠT ĐỘNG (ACTIVE) đầu tiên
          const firstActive = courtsData.find((c) => c.status === "ACTIVE");
          if (firstActive) setSelectedCourtId(firstActive._id);
          else if (courtsData.length > 0) setSelectedCourtId(courtsData[0]._id);
        }
        if (slotsData) {
          setTimeSlots(slotsData);
        }
      } catch (error) {
        console.error("Lỗi lấy dữ liệu trang chi tiết:", error);
      } finally {
        setLoading(false);
      }
    };

    if (centerId) {
      fetchInitialData();
    }
  }, [centerId]);

  // Reset ảnh chính về ảnh CỤM SÂN khi chuyển sang cụm sân khác
  useEffect(() => {
    setActiveImage(null);
  }, [centerId]);

  // 2. Tải danh sách Slot ĐÃ ĐẶT (BookedSlots) bất cứ khi nào Chọn Ngày thay đổi
  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!selectedDate || courts.length === 0) return;
      try {
        const courtIds = courts.map((c) => c._id);
        const bookedData = await clientCourtService.getBookedSlots(selectedDate, courtIds);
        setBookedSlots(bookedData);
      } catch (error) {
        console.error("Lỗi lấy slot đã đặt:", error);
      }
    };

    fetchBookedSlots();
  }, [selectedDate, courts]);

  // Hàm toggle chọn/bỏ cặp (court, time slot)
  const togglePair = useCallback((courtId: string, slotId: string) => {
    setSelectedPairs((prev) => {
      const next = new Set(prev);
      const pair = `${courtId}:${slotId}`;
      if (next.has(pair)) {
        next.delete(pair);
      } else {
        next.add(pair);
      }
      return next;
    });
  }, []);

  // Kiểm tra cặp (court, slot) đã được chọn chưa
  const isPairSelected = useCallback(
    (courtId: string, slotId: string) => {
      return selectedPairs.has(`${courtId}:${slotId}`);
    },
    [selectedPairs]
  );

  // Kiểm tra cặp (court, slot) đã bị đặt bởi người khác hay chưa
  const isBooked = useCallback(
    (courtId: string, slotId: string) => {
      return bookedSlots.some(
        (b) =>
          b.court_id.toString() === courtId &&
          b.time_slot_id.toString() === slotId &&
          b.booking_for_date === selectedDate
      );
    },
    [bookedSlots, selectedDate]
  );

  // Tính tổng tiền của tất cả các cặp đã chọn
  const totalPrice = useMemo(() => {
    let total = 0;
    selectedPairs.forEach((pair) => {
      const [courtId, slotId] = pair.split(":");
      const court = courts.find((c) => c._id === courtId);
      const slot = timeSlots.find((s) => s._id === slotId);
      if (court && slot) {
        const price =
          slot.is_peak_hour && court.peak_price ? court.peak_price : court.price || defaultPrice;
        total += price;
      }
    });
    return total;
  }, [selectedPairs, courts, timeSlots, defaultPrice]);

  // Danh sách ảnh hiển thị strip: Ảnh CỤM SÂN (thumbnail) đứng đầu, sau đó là ảnh các SÂN trong cụm
  const courtImages = useMemo(() => {
    const seen = new Set<string>();
    const list: { courtId: string; courtName: string; image: string }[] = [];

    // Ảnh đại diện cụm sân - chỉ thêm khi cụm thực sự có thumbnail (tránh hiện ảnh fallback)
    if (courtCenter?.thumbnail) {
      seen.add(courtCenter.thumbnail);
      list.push({
        courtId: "center",
        courtName: courtCenter.name || "Cụm sân",
        image: courtCenter.thumbnail,
      });
    }

    // Ảnh từng sân trong cụm (loại bỏ ảnh trùng với nhau và trùng với ảnh cụm sân)
    courts.forEach((c) => {
      if (!c.thumbnail) return;
      if (seen.has(c.thumbnail)) return;
      seen.add(c.thumbnail);
      list.push({ courtId: c._id, courtName: c.court_name, image: c.thumbnail });
    });

    return list;
  }, [courtCenter, courts]);

  if (loading) {
    return (
      <main className="detail-main">
        <div className="detail-container" style={{ textAlign: "center", padding: "60px 0", color: "#00236f" }}>
          Đang tải thông tin chi tiết cụm sân...
        </div>
      </main>
    );
  }

  if (!courtCenter) {
    return (
      <main className="detail-main">
        <div className="detail-container" style={{ textAlign: "center", padding: "60px 0", color: "#dc2626" }}>
          Không tìm thấy thông tin cụm sân!
        </div>
      </main>
    );
  }

  const sportName = typeof courtCenter.sport_id === "object" ? courtCenter.sport_id?.name : "Thể thao";
  const ratingAvg = courtCenter.average_rating ? courtCenter.average_rating.toFixed(1) : "—";
  const bookingCount = courtCenter.total_bookings || 0;
  const thumbnailUrl = courtCenter.thumbnail || "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800";
  // Ảnh chính đang hiển thị (mặc định ảnh cụm sân, đổi khi bấm ảnh sân phía dưới)
  const mainImage = activeImage || thumbnailUrl;

  // Build URL checkout với nhiều cặp sân:giờ (dạng "courtId:slotId,courtId:slotId,...")
  const pairsQuery = Array.from(selectedPairs).join(",");
  const checkoutUrl = `/checkout?center_id=${courtCenter._id}&date=${selectedDate}&pairs=${encodeURIComponent(pairsQuery)}`;

  return (
    <main className="detail-main">
      <div className="detail-container">
        {/* Breadcrumbs */}
        <nav className="breadcrumbs">
          <Link href="/" className="breadcrumb-item">Trang chủ</Link>
          <span className="material-symbols-outlined breadcrumb-separator">chevron_right</span>
          <Link href="/courts" className="breadcrumb-item">{sportName}</Link>
          <span className="material-symbols-outlined breadcrumb-separator">chevron_right</span>
          <span className="breadcrumb-item active">{courtCenter.name}</span>
        </nav>

        {/* Detail Grid Layout */}
        <div className="detail-grid">
          <div className="detail-left">
            {/* Bento Gallery - ảnh CỤM SÂN + strip ảnh các SÂN trong cụm */}
            <section className="bento-gallery">
              <div className="gallery-main">
                <img src={mainImage} alt={courtCenter.name} className="gallery-img" />
              </div>
              {courtImages.length > 0 && (
                <div className="court-thumb-strip">
                  {courtImages.map((item) => (
                    <button
                      key={item.courtId}
                      type="button"
                      className={`court-thumb-item${mainImage === item.image ? " active" : ""}`}
                      onClick={() => setActiveImage(item.image)}
                      title={item.courtName}
                      aria-label={`Xem ảnh sân ${item.courtName}`}
                    >
                      <img src={item.image} alt={item.courtName} loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
            </section>

            {/* Title Header */}
            <section className="detail-header-info">
              <div className="title-action-row">
                <h1 className="court-detail-title">{courtCenter.name}</h1>
                <div className="action-buttons">
                  <button className="icon-action-btn" title="Chia sẻ">
                    <span className="material-symbols-outlined">share</span>
                  </button>
                  <button className="icon-action-btn" title="Yêu thích">
                    <span className="material-symbols-outlined">favorite</span>
                  </button>
                </div>
              </div>

              <p className="court-detail-address">
                <span className="material-symbols-outlined icon-address">location_on</span>
                {courtCenter.address}
              </p>

              <div className="badge-row">
                <span className="badge rating-badge">
                  <span className="material-symbols-outlined">star</span> {ratingAvg}
                </span>
                <span className="badge booking-badge">
                  <span className="material-symbols-outlined">local_fire_department</span> Đã đặt {bookingCount} lần
                </span>
                <span className="badge sport-badge">
                  <span className="material-symbols-outlined">sports_tennis</span> {sportName}
                </span>
              </div>
            </section>

            {/* Tiện ích sân */}
            <section className="detail-section">
              <h2 className="section-subtitle">Tiện ích sân</h2>
              <div className="amenities-grid">
                <div className="amenity-card">
                  <span className="material-symbols-outlined amenity-icon">local_parking</span>
                  <span className="amenity-name">Gửi xe miễn phí</span>
                </div>
                <div className="amenity-card">
                  <span className="material-symbols-outlined amenity-icon">shower</span>
                  <span className="amenity-name">Phòng tắm & Tủ đồ</span>
                </div>
                <div className="amenity-card">
                  <span className="material-symbols-outlined amenity-icon">restaurant</span>
                  <span className="amenity-name">Căng tin / Cà phê</span>
                </div>
                <div className="amenity-card">
                  <span className="material-symbols-outlined amenity-icon">ac_unit</span>
                  <span className="amenity-name">Điều hòa nhiệt độ</span>
                </div>
              </div>
            </section>

            {/* Mô tả */}
            <section className="detail-section">
              <h2 className="section-subtitle">Mô tả cụm sân</h2>
              <div className="court-description">
                <p>{courtCenter.description || `Trải nghiệm chất lượng quốc tế trên hệ thống ${courtCenter.name} chuyên nghiệp, được thiết kế với các tiêu chuẩn cao nhất.`}</p>
                <p>Giờ hoạt động: {courtCenter.opening_time || "06:00"} - {courtCenter.closing_time || "23:00"} liên tục tất cả các ngày trong tuần.</p>
              </div>
            </section>

            {/* Bảng giá */}
            <section className="detail-section">
              <h2 className="section-subtitle">Bảng giá tham khảo</h2>
              <div className="pricing-card">
                <div className="pricing-row">
                  <span className="pricing-time">Giờ thường ({courtCenter.opening_time || "06:00"} - 16:00)</span>
                  <span className="pricing-val">{defaultPrice.toLocaleString("vi-VN")} VNĐ</span>
                </div>
                <div className="pricing-row">
                  <span className="pricing-time">Giờ cao điểm (16:00 - {courtCenter.closing_time || "23:00"})</span>
                  <span className="pricing-val">{(defaultPrice * 1.4).toLocaleString("vi-VN")} VNĐ</span>
                </div>
              </div>
            </section>

            {/* Vị trí */}
            <section className="detail-section">
              <h2 className="section-subtitle">Vị trí</h2>
              <div className="map-placeholder">
                <span className="material-symbols-outlined map-icon">map</span>
                <p className="map-text">{courtCenter.address}</p>
              </div>
            </section>
          </div>

          {/* Right Side: Đặt Sân */}
          <div className="detail-right">
            <div className="booking-widget">
              <div className="widget-header">
                <div className="widget-price-info">
                  <span className="widget-price">Từ {defaultPrice.toLocaleString("vi-VN")}đ</span>
                  <span className="widget-unit">/ giờ</span>
                </div>
                <div className="widget-rating-badge">
                  <span className="material-symbols-outlined">star</span>
                  <span>{ratingAvg}</span>
                </div>
              </div>

              {/* Booking Form */}
              <form className="booking-form" onSubmit={(e) => e.preventDefault()}>
                {/* Chọn ngày */}
                <div className="form-item">
                  <label className="form-item-label">CHỌN NGÀY</label>
                  <input
                    type="date"
                    className="booking-input"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>

                {/* Chọn sân chi tiết (giữ UI cũ: chọn sân nào thì show khung giờ sân đó) */}
                <div className="form-item">
                  <label className="form-item-label">CHỌN SÂN</label>
                  <div className="court-selector-grid">
                    {courts.length > 0 ? (
                      courts.map((c) => {
                        const isInactive = c.status !== "ACTIVE";
                        const isSelected = selectedCourtId === c._id;
                        return (
                          <div
                            key={c._id}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 4,
                            }}
                          >
                            <button
                              type="button"
                              disabled={isInactive}
                              className={`court-select-btn ${isSelected ? "active" : ""}`}
                              onClick={() => {
                                setSelectedCourtId(c._id);
                                // Khi người dùng chọn sân: hiển thị ảnh của sân đó lên ảnh chính (nếu sân không có ảnh thì quay về ảnh cụm sân)
                                setActiveImage(c.thumbnail || null);
                              }}
                              style={
                                isInactive
                                  ? {
                                    opacity: 0.45,
                                    cursor: "not-allowed",
                                    backgroundColor: "#f3f4f6",
                                    color: "#9ca3af",
                                    textDecoration: "line-through",
                                  }
                                  : isSelected
                                    ? { backgroundColor: "#00236f", color: "#fff", borderColor: "#00236f" }
                                    : {}
                              }
                            >
                              {c.court_name}
                            </button>
                            {isInactive && (
                              <span style={{ fontSize: 10, fontWeight: 700, color: "#dc2626", textAlign: "center" }}>
                                {c.status === "MAINTENANCE" ? " Bảo trì" : " Tạm đóng"}
                              </span>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <span style={{ fontSize: "12px", color: "#6b7280" }}>Đang tải danh sách sân...</span>
                    )}
                  </div>
                </div>

                {/* Chọn Khung giờ chỉ của Sân ĐANG CHỌN (cho phép chọn nhiều khung giờ) */}
                <div className="form-item">
                  <label className="form-item-label">
                    KHUNG GIỜ - {courts.find((c) => c._id === selectedCourtId)?.court_name || "Sân"}
                  </label>
                  {(() => {
                    const selectedCourtObj = courts.find((c) => c._id === selectedCourtId);
                    const selectedInactive = selectedCourtObj && selectedCourtObj.status !== "ACTIVE";
                    if (selectedInactive) {
                      return (
                        <div style={{
                          padding: "12px",
                          backgroundColor: "#fef2f2",
                          border: "1px dashed #fca5a5",
                          borderRadius: 8,
                          color: "#991b1b",
                          textAlign: "center",
                          fontSize: 13,
                          fontWeight: 600,
                        }}>
                          Sân này {selectedCourtObj.status === "MAINTENANCE" ? "đang bảo trì" : "đang tạm đóng"} — không thể chọn khung giờ.
                        </div>
                      );
                    }
                    return (
                      <div className="time-slot-grid">
                        {timeSlots.map((slot) => {
                          const booked = isBooked(selectedCourtId, slot._id);
                          const selected = isPairSelected(selectedCourtId, slot._id);
                          return (
                            <button
                              key={slot._id}
                              type="button"
                              disabled={booked}
                              className={`slot-btn ${booked ? "disabled" : selected ? "active" : ""}`}
                              onClick={() => !booked && togglePair(selectedCourtId, slot._id)}
                              title={booked ? "Khung giờ này đã có người đặt!" : selected ? "Bấm để bỏ chọn khung giờ" : "Bấm để chọn khung giờ này"}
                              style={
                                booked
                                  ? {
                                    opacity: 0.4,
                                    cursor: "not-allowed",
                                    backgroundColor: "#e5e7eb",
                                    color: "#9ca3af",
                                    textDecoration: "line-through",
                                  }
                                  : selected
                                    ? { backgroundColor: "#00236f", color: "#fff", borderColor: "#00236f" }
                                    : {}
                              }
                            >
                              {slot.start_time} - {slot.end_time}
                              {slot.is_peak_hour && <span style={{ fontSize: "10px", color: booked ? "#9ca3af" : "#dc2626", marginLeft: "2px" }}>🔥</span>}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })()}
                  <p className={`selection-count ${selectedPairs.size > 0 ? "has-selection" : ""}`}>
                    {selectedPairs.size > 0
                      ? `Đã chọn ${selectedPairs.size} khung giờ (từ ${courts.filter((c) => Array.from(selectedPairs).some((p) => p.startsWith(`${c._id}:`))).length} sân)`
                      : "Chưa chọn khung giờ nào"}
                  </p>
                </div>

                {/* Chi tiết tiền */}
                <div className="price-breakdown">
                  {Array.from(selectedPairs).map((pair) => {
                    const [courtId, slotId] = pair.split(":");
                    const court = courts.find((c) => c._id === courtId);
                    const slot = timeSlots.find((s) => s._id === slotId);
                    if (!court || !slot) return null;
                    const price =
                      slot.is_peak_hour && court.peak_price ? court.peak_price : court.price || defaultPrice;
                    return (
                      <div key={pair} className="breakdown-row">
                        <span>
                          {court.court_name} ({slot.start_time}-{slot.end_time}
                          {slot.is_peak_hour ? " - cao điểm" : ""})
                        </span>
                        <span>{price.toLocaleString("vi-VN")}đ</span>
                      </div>
                    );
                  })}
                  <div className="breakdown-row total-row">
                    <span>Tổng cộng</span>
                    <span>{totalPrice.toLocaleString("vi-VN")}đ</span>
                  </div>
                </div>

                <Link
                  href={selectedPairs.size > 0 ? checkoutUrl : "#"}
                  onClick={(e) => {
                    if (selectedPairs.size === 0) {
                      e.preventDefault();
                      alert("Vui lòng chọn ít nhất 1 sân và 1 khung giờ trước khi đặt.");
                    }
                  }}
                  className={`btn-booking-submit ${selectedPairs.size === 0 ? "disabled-link" : ""}`}
                  style={{
                    display: "block",
                    textAlign: "center",
                    textDecoration: "none",
                    ...(selectedPairs.size === 0 ? { opacity: 0.5, pointerEvents: "none", cursor: "not-allowed" } : {}),
                  }}
                >
                  Đặt sân ngay
                </Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
