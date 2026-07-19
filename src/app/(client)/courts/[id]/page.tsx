import { ICourt } from "@/interface/court";
import Link from "next/link";
const courts: ICourt[] = [
    {
        id: "c001",
        name: "CLB Pickleball Phú Nhuận",
        sport_type: "Pickleball",
        thumbnail: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=600&auto=format&fit=crop",
        booking_count: 120,
        rating_avg: 4.9,
        address: "18A Phan Đăng Lưu, Phường 6, Phú Nhuận, TPHCM",
        min_price: 80000,
        is_new: false
    },
    {
        id: "c002",
        name: "Sân Tennis Kỳ Hòa",
        sport_type: "Tennis",
        thumbnail: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=600&auto=format&fit=crop",
        booking_count: 98,
        rating_avg: 4.7,
        address: "238 Ba Tháng Hai, Quận 10, TPHCM",
        min_price: 150000,
        is_new: false
    },
    {
        id: "c003",
        name: "Sân Cầu Lông Viettel",
        sport_type: "Cầu lông",
        thumbnail: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600&auto=format&fit=crop",
        booking_count: 85,
        rating_avg: 4.8,
        address: "158 Hoàng Hoa Thám, Tân Bình, TPHCM",
        min_price: 60000,
        is_new: false
    },
    {
        id: "c004",
        name: "Sân Pickleball Thảo Điền",
        sport_type: "Pickleball",
        thumbnail: "https://images.unsplash.com/photo-1545224827-c8121665a371?q=80&w=600&auto=format&fit=crop",
        booking_count: 12,
        rating_avg: 5.0,
        address: "Nguyễn Văn Hưởng, Thảo Điền, Quận 2, TPHCM",
        min_price: 100000,
        is_new: true
    },
    {
        id: "c005",
        name: "CLB Tennis Lan Anh",
        sport_type: "Tennis",
        thumbnail: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=600&auto=format&fit=crop",
        booking_count: 215,
        rating_avg: 4.6,
        address: "291 Cách Mạng Tháng 8, Quận 10, TPHCM",
        min_price: 180000,
        is_new: false
    },
    {
        id: "c006",
        name: "Sân Cầu Lông Thống Nhất",
        sport_type: "Cầu lông",
        thumbnail: "https://images.unsplash.com/photo-1589801258579-18e091f4ca26?q=80&w=600&auto=format&fit=crop",
        booking_count: 150,
        rating_avg: 4.5,
        address: "138 Đào Duy Anh, Phú Nhuận, TPHCM",
        min_price: 70000,
        is_new: false
    },
    {
        id: "c007",
        name: "Pickleball D7 Sports",
        sport_type: "Pickleball",
        thumbnail: "https://images.unsplash.com/photo-1545224827-c8121665a371?q=80&w=600&auto=format&fit=crop",
        booking_count: 45,
        rating_avg: 4.8,
        address: "Khu dân cư Him Lam, Quận 7, TPHCM",
        min_price: 120000,
        is_new: true
    },
    {
        id: "c008",
        name: "Trung Tâm Tennis Phú Thọ",
        sport_type: "Tennis",
        thumbnail: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=600&auto=format&fit=crop",
        booking_count: 320,
        rating_avg: 4.4,
        address: "219 Lý Thường Kiệt, Quận 11, TPHCM",
        min_price: 130000,
        is_new: false
    },
    {
        id: "c009",
        name: "Cầu Lông K34",
        sport_type: "Cầu lông",
        thumbnail: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600&auto=format&fit=crop",
        booking_count: 95,
        rating_avg: 4.7,
        address: "Bạch Đằng, Tân Bình, TPHCM",
        min_price: 65000,
        is_new: false
    },
    {
        id: "c010",
        name: "Pickleball Celadon City",
        sport_type: "Pickleball",
        thumbnail: "https://images.unsplash.com/photo-1545224827-c8121665a371?q=80&w=600&auto=format&fit=crop",
        booking_count: 28,
        rating_avg: 4.9,
        address: "Khu đô thị Celadon City, Tân Phú, TPHCM",
        min_price: 90000,
        is_new: true
    }
];
export default async function CourtDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const court = courts.find(c => c.id === params.id);

    if (!court) {
        return <div className="detail-main"><div className="detail-container">Không tìm thấy sân!</div></div>;
    }
    console.log(">>>>> check id", params.id);

    return (
        <main className="detail-main">
            <div className="detail-container">

                {/* Breadcrumbs */}
                <nav className="breadcrumbs">
                    <Link href="/" className="breadcrumb-item">Trang chủ</Link>
                    <span className="material-symbols-outlined breadcrumb-separator">chevron_right</span>
                    <Link href="#" className="breadcrumb-item">{court.sport_type}</Link>
                    <span className="material-symbols-outlined breadcrumb-separator">chevron_right</span>
                    <span className="breadcrumb-item active">{court.name}</span>
                </nav>

                {/* Detail Grid Layout */}
                <div className="detail-grid">

                    <div className="detail-left">

                        <section className="bento-gallery">
                            <div className="gallery-main">
                                <img src={court.thumbnail} alt={court.name} className="gallery-img" />
                            </div>
                            <div className="gallery-side">
                                <div className="gallery-thumb">
                                    <img src={court.thumbnail} alt="Sân 2" className="gallery-img" />
                                </div>
                                <div className="gallery-thumb show-more">
                                    <img src={court.thumbnail} alt="Sân 3" className="gallery-img" />
                                    <div className="gallery-overlay">
                                        <span className="material-symbols-outlined">grid_view</span>
                                        <span>Xem thêm ảnh</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Title */}
                        <section className="detail-header-info">
                            <div className="title-action-row">
                                <h1 className="court-detail-title">{court.name}</h1>
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
                                {court.address}
                            </p>

                            <div className="badge-row">
                                <span className="badge rating-badge">
                                    <span className="material-symbols-outlined">star</span> {court.rating_avg}
                                </span>
                                <span className="badge booking-badge">
                                    <span className="material-symbols-outlined">local_fire_department</span> Đã đặt {court.booking_count} lần
                                </span>
                                <span className="badge sport-badge">
                                    <span className="material-symbols-outlined">sports_tennis</span> {court.sport_type}
                                </span>
                            </div>
                        </section>

                        {/* Tiện ích  */}
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

                        {/* Description Section */}
                        <section className="detail-section">
                            <h2 className="section-subtitle">Mô tả</h2>
                            <div className="court-description">
                                <p>Trải nghiệm chất lượng quốc tế trên hệ thống sân {court.sport_type} chuyên nghiệp, được thiết kế
                                    với các tiêu chuẩn cao nhất. Hệ thống chiếu sáng LED chuyên nghiệp và không gian rộng
                                    rãi đảm bảo trải nghiệm thi đấu tốt nhất cho cả những trận giao hữu lẫn giải đấu đỉnh
                                    cao.</p>
                                <p>Câu lạc bộ mở cửa liên tục phục vụ người chơi, cung cấp các dụng cụ thuê đạt tiêu chuẩn
                                    cao cấp nhất từ các thương hiệu hàng đầu thế giới.</p>
                            </div>
                        </section>

                        {/* Pricing Section */}
                        <section className="detail-section">
                            <h2 className="section-subtitle">Bảng giá</h2>
                            <div className="pricing-card">
                                <div className="pricing-row">
                                    <span className="pricing-time">05:00 - 16:00</span>
                                    <span className="pricing-val">{court.min_price.toLocaleString("vi-VN")} VNĐ</span>
                                </div>
                                <div className="pricing-row">
                                    <span className="pricing-time">16:00 - 22:00</span>
                                    <span className="pricing-val">{(court.min_price * 1.5).toLocaleString("vi-VN")} VNĐ</span>
                                </div>
                            </div>
                        </section>

                        {/* Map Section */}
                        <section className="detail-section">
                            <h2 className="section-subtitle">Vị trí</h2>
                            <div className="map-placeholder">
                                <span className="material-symbols-outlined map-icon">map</span>
                                <p className="map-text">{court.address}</p>
                            </div>
                        </section>

                    </div>

                    {/* Right Side: Booking Sidebar Widget */}
                    <div className="detail-right">
                        <div className="booking-widget">
                            <div className="widget-header">
                                <div className="widget-price-info">
                                    <span className="widget-price">Từ {court.min_price.toLocaleString("vi-VN")}đ</span>
                                    <span className="widget-unit">/ giờ</span>
                                </div>
                                <div className="widget-rating-badge">
                                    <span className="material-symbols-outlined">star</span>
                                    <span>{court.rating_avg}</span>
                                </div>
                            </div>

                            {/* Booking Form */}
                            <form className="booking-form">
                                {/* Date Select */}
                                <div className="form-item">
                                    <label className="form-item-label">CHỌN NGÀY</label>
                                    <input type="date" className="booking-input" defaultValue="2026-07-15" />
                                </div>

                                {/* Court Select */}
                                <div className="form-item">
                                    <label className="form-item-label">CHỌN SÂN</label>
                                    <div className="court-selector-grid">
                                        <button type="button" className="court-select-btn active">Sân 1</button>
                                        <button type="button" className="court-select-btn">Sân 2</button>
                                        <button type="button" className="court-select-btn">Sân 3</button>
                                        <button type="button" className="court-select-btn">Sân 4</button>
                                    </div>
                                </div>

                                {/* Time Slot Grid */}
                                <div className="form-item">
                                    <label className="form-item-label">KHUNG GIỜ TRỐNG</label>
                                    <div className="time-slot-grid">
                                        <button type="button" className="slot-btn active">08:00 - 09:00</button>
                                        <button type="button" className="slot-btn">09:00 - 10:00</button>
                                        <button type="button" className="slot-btn">10:00 - 11:00</button>
                                        <button type="button" className="slot-btn disabled" disabled>11:00 - 12:00</button>
                                        <button type="button" className="slot-btn">14:00 - 15:00</button>
                                        <button type="button" className="slot-btn">15:00 - 16:00</button>
                                        <button type="button" className="slot-btn">16:00 - 17:00</button>
                                        <button type="button" className="slot-btn disabled" disabled>17:00 - 18:00</button>
                                    </div>
                                </div>

                                {/* Breakdown */}
                                <div className="price-breakdown">
                                    <div className="breakdown-row">
                                        <span>Thuê sân (1 giờ)</span>
                                        <span>{court.min_price.toLocaleString("vi-VN")}đ</span>
                                    </div>
                                    <div className="breakdown-row total-row">
                                        <span>Tổng cộng</span>
                                        <span>{court.min_price.toLocaleString("vi-VN")}đ</span>
                                    </div>
                                </div>

                                <Link href="/checkout" className="btn-booking-submit">Đặt sân ngay</Link>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
