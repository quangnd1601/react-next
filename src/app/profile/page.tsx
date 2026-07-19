"use client";

import { useState } from "react";
import "./page.css";

// Mock data for bookings
const MOCK_BOOKINGS = [
    {
        id: "booking1",
        code: "COURT-78932",
        status: "confirmed",
        payment: "paid",
        title: "Cụm Sân Pickleball Thảo Điền",
        court: "Sân 03",
        sport: "pickleball",
        address: "12 Đường Thảo Điền, Thảo Điền, Quận 2, TP. HCM",
        date: "21/07/2026",
        timeSlot: "17:00-18:00, 18:00-19:00",
        note: "Cần mượn thêm 2 vợt Pickleball.",
        price: "300.000đ",
    },
    {
        id: "booking2",
        code: "COURT-55210",
        status: "pending",
        payment: "unpaid",
        title: "Sân Tennis Kỳ Hòa",
        court: "Sân Số 2",
        sport: "tennis",
        address: "238 Đường 3/2, Phường 12, Quận 10, TP. HCM",
        date: "24/07/2026",
        timeSlot: "19:00-20:00, 20:00-21:00",
        note: "Bật đèn đêm từ 19:00.",
        price: "400.000đ",
    },
    {
        id: "booking3",
        code: "COURT-12489",
        status: "completed",
        payment: "paid",
        title: "Trung Tâm Cầu Lông Sunrise",
        court: "Sân A1",
        sport: "badminton",
        address: "456 Nguyễn Hữu Thọ, Tân Hưng, Quận 7, TP. HCM",
        date: "15/07/2026",
        timeSlot: "08:00-09:00, 09:00-10:00",
        note: "",
        price: "180.000đ",
    },
    {
        id: "booking4",
        code: "COURT-99812",
        status: "cancelled",
        payment: "refunded",
        title: "Sân Bóng Đá Mini Sport Land",
        court: "Sân 5 Người B",
        sport: "football",
        address: "102 Phan Huy Ích, Phường 15, Tân Bình, TP. HCM",
        date: "10/07/2026",
        timeSlot: "16:00-17:30",
        note: "Huỷ do trời mưa bão lớn.",
        price: "250.000đ",
    }
];

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState<"profile" | "password" | "bookings">("profile");
    const [bookingFilter, setBookingFilter] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [sportFilter, setSportFilter] = useState<string>("all");

    // Filter logic
    const filteredBookings = MOCK_BOOKINGS.filter((booking) => {
        const matchesStatus = bookingFilter === "all" || booking.status === bookingFilter;
        const matchesSport = sportFilter === "all" || booking.sport === sportFilter;
        
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = 
            booking.code.toLowerCase().includes(searchLower) ||
            booking.title.toLowerCase().includes(searchLower) ||
            booking.court.toLowerCase().includes(searchLower) ||
            booking.address.toLowerCase().includes(searchLower);

        return matchesStatus && matchesSport && matchesSearch;
    });

    return (
        <div className="profile-container">
            <div className="profile-layout">

                <aside className="profile-sidebar">
                    <div className="profile-user-card">
                        <div className="profile-avatar-wrapper">
                            <img alt="User Avatar" className="profile-avatar" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop" />
                        </div>
                        <h3 className="profile-user-name">Nguyễn Văn A</h3>
                        <p className="profile-user-email">nguyenvana@example.com</p>
                    </div>

                    <nav className="profile-tabs">
                        <button
                            id="tab-profile-btn"
                            className={`profile-tab-btn ${activeTab === "profile" ? "active" : ""}`}
                            onClick={() => setActiveTab("profile")}
                        >
                            <span className="material-symbols-outlined">person</span>
                            <span>Thông tin cá nhân</span>
                        </button>
                        <button
                            id="tab-password-btn"
                            className={`profile-tab-btn ${activeTab === "password" ? "active" : ""}`}
                            onClick={() => setActiveTab("password")}
                        >
                            <span className="material-symbols-outlined">lock</span>
                            <span>Thay đổi mật khẩu</span>
                        </button>
                        <button
                            id="tab-bookings-btn"
                            className={`profile-tab-btn ${activeTab === "bookings" ? "active" : ""}`}
                            onClick={() => setActiveTab("bookings")}
                        >
                            <span className="material-symbols-outlined">event_note</span>
                            <span>Lịch đặt của tôi</span>
                        </button>
                    </nav>
                </aside>

                <main className="profile-main-content">

                    <section id="tab-profile-content" className={`profile-tab-panel ${activeTab === "profile" ? "active" : ""}`}>
                        <div className="profile-card">
                            <div className="profile-card-header">
                                <h2 className="profile-card-title">Thông Tin Cá Nhân</h2>
                                <p className="profile-card-subtitle">Quản lý và cập nhật thông tin họ tên, số điện thoại của bạn</p>
                            </div>

                            <form id="profile-form" className="profile-form">
                                <div className="form-group">
                                    <label className="form-label">Họ và tên</label>
                                    <input
                                        type="text"
                                        id="profile-name"
                                        defaultValue="Nguyễn Văn A"
                                        required
                                        className="form-input"
                                        placeholder="Nhập họ và tên"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Email (Không thể thay đổi)</label>
                                    <input
                                        type="email"
                                        id="profile-email"
                                        defaultValue="nguyenvana@example.com"
                                        disabled
                                        className="form-input disabled"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Số điện thoại</label>
                                    <input
                                        type="text"
                                        id="profile-phone"
                                        defaultValue="0987654321"
                                        required
                                        className="form-input"
                                        placeholder="Nhập số điện thoại"
                                    />
                                </div>

                                <div className="form-actions">
                                    <button type="submit" id="save-profile-btn" className="btn btn-primary">
                                        Cập nhật thông tin
                                    </button>
                                </div>
                            </form>
                        </div>
                    </section>

                    <section id="tab-password-content" className={`profile-tab-panel ${activeTab === "password" ? "active" : ""}`}>
                        <div className="profile-card">
                            <div className="profile-card-header">
                                <h2 className="profile-card-title">Thay Đổi Mật Khẩu</h2>
                                <p className="profile-card-subtitle">Đảm bảo an toàn tài khoản bằng cách sử dụng mật khẩu mạnh</p>
                            </div>

                            <form id="password-form" className="profile-form">
                                <div className="form-group">
                                    <label className="form-label">Mật khẩu hiện tại</label>
                                    <input
                                        type="password"
                                        id="profile-current-password"
                                        placeholder="Nhập mật khẩu hiện tại"
                                        required
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Mật khẩu mới</label>
                                    <input
                                        type="password"
                                        id="profile-new-password"
                                        placeholder="Mật khẩu mới (tối thiểu 6 ký tự)"
                                        required
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Xác nhận mật khẩu mới</label>
                                    <input
                                        type="password"
                                        id="profile-confirm-password"
                                        placeholder="Xác nhận mật khẩu mới"
                                        required
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-actions">
                                    <button type="submit" id="save-password-btn" className="btn btn-primary">
                                        Thay đổi mật khẩu
                                    </button>
                                </div>
                            </form>
                        </div>
                    </section>

                    <section id="tab-bookings-content" className={`profile-tab-panel ${activeTab === "bookings" ? "active" : ""}`}>

                        <div className="booking-status-nav">
                            <button className={`booking-status-tab ${bookingFilter === "all" ? "active" : ""}`} onClick={() => setBookingFilter("all")}>Tất cả</button>
                            <button className={`booking-status-tab ${bookingFilter === "pending" ? "active" : ""}`} onClick={() => setBookingFilter("pending")}>Chờ duyệt</button>
                            <button className={`booking-status-tab ${bookingFilter === "confirmed" ? "active" : ""}`} onClick={() => setBookingFilter("confirmed")}>Đã xác nhận</button>
                            <button className={`booking-status-tab ${bookingFilter === "completed" ? "active" : ""}`} onClick={() => setBookingFilter("completed")}>Đã hoàn thành</button>
                            <button className={`booking-status-tab ${bookingFilter === "cancelled" ? "active" : ""}`} onClick={() => setBookingFilter("cancelled")}>Đã hủy</button>
                        </div>

                        {/* Search & Filter Bar */}
                        <div className="booking-search-filter">
                            <div className="search-input-wrapper">
                                <span className="material-symbols-outlined">search</span>
                                <input
                                    type="text"
                                    placeholder="Tìm theo mã đặt sân, tên cụm sân..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="filter-select-wrapper">
                                <select
                                    value={sportFilter}
                                    onChange={(e) => setSportFilter(e.target.value)}
                                >
                                    <option value="all">Tất cả môn thể thao</option>
                                    <option value="pickleball">Pickleball</option>
                                    <option value="badminton">Cầu lông</option>
                                    <option value="tennis">Tennis</option>
                                    <option value="football">Bóng đá</option>
                                </select>
                                <span className="material-symbols-outlined">filter_list</span>
                            </div>
                        </div>

                        <div id="bookings-list-container" className="bookings-list">
                            {filteredBookings.length > 0 ? (
                                filteredBookings.map((booking) => (
                                    <div key={booking.id} className="booking-card" data-status={booking.status}>
                                        <div className="booking-card-body">
                                            <div className="booking-header">
                                                <div className="booking-meta">
                                                    <span className="booking-code">{booking.code}</span>
                                                    <span className={`booking-badge status-${booking.status}`}>
                                                        {booking.status === "confirmed" && "Đã xác nhận"}
                                                        {booking.status === "pending" && "Chờ duyệt"}
                                                        {booking.status === "completed" && "Hoàn thành"}
                                                        {booking.status === "cancelled" && "Đã hủy"}
                                                    </span>
                                                    <span className={`booking-badge payment-${booking.payment}`}>
                                                        {booking.payment === "paid" && "Đã thanh toán"}
                                                        {booking.payment === "unpaid" && "Chưa thanh toán"}
                                                        {booking.payment === "refunded" && "Đã hoàn tiền"}
                                                    </span>
                                                </div>
                                            </div>
                                            <h4 className="booking-title">{booking.title} - <span className="court-name">{booking.court}</span></h4>
                                            <p className="booking-info address">
                                                <span className="material-symbols-outlined">location_on</span> {booking.address}
                                            </p>
                                            <p className="booking-info datetime">
                                                <span className="material-symbols-outlined">calendar_month</span> Ngày: <strong>{booking.date}</strong> | Khung giờ: <strong>{booking.timeSlot}</strong>
                                            </p>
                                            {booking.note && (
                                                <p className="booking-note">Ghi chú: {booking.note}</p>
                                            )}
                                        </div>
                                        <div className="booking-card-actions">
                                            <div className="booking-price-wrapper">
                                                <span className="price-label">Tổng cộng</span>
                                                <div className="booking-price">{booking.price}</div>
                                            </div>
                                            {booking.status === "confirmed" && (
                                                <button className="cancel-booking-btn">Hủy đặt sân</button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div id="no-bookings-message" className="no-bookings-placeholder">
                                    <span className="material-symbols-outlined placeholder-icon">event_busy</span>
                                    <p>Không có lịch đặt sân nào phù hợp với bộ lọc tìm kiếm.</p>
                                </div>
                            )}
                        </div>
                    </section>

                </main>
            </div>
        </div>
    );
}
