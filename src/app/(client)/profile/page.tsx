"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { IBooking } from "@/interface/profile";
import "./page.css";
import { API_BASE_URL } from "@/config/env";
import { authedFetch } from "@/services/client/session";

// ----- Helpers -----
const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return "—";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
};

const formatPrice = (price: number) => {
    if (!price && price !== 0) return "0đ";
    return `${price.toLocaleString("vi-VN")}đ`;
};

const getStatusLabel = (status: string) => {
    switch (status) {
        case "PENDING": return "Chờ duyệt";
        case "CONFIRMED": return "Đã xác nhận";
        case "COMPLETED": return "Hoàn thành";
        case "CANCELLED": return "Đã hủy";
        default: return status;
    }
};

const getPaymentBadge = (b: IBooking) => {
    if (b.payment_method === "cash") return { label: "Tiền mặt", className: "payment-cash" };
    const key = b.payment?.payment_status ?? "NONE";
    switch (key) {
        case "SUCCESS": return { label: "Đã thanh toán", className: "payment-paid" };
        case "REFUND_PENDING": return { label: "Chờ hoàn tiền", className: "payment-pending" };
        case "REFUNDED": return { label: "Đã hoàn tiền", className: "payment-pending" };
        case "FAILED": return { label: "Đã hủy", className: "payment-pending" };
        default: return { label: "Chưa thanh toán", className: "payment-pending" };
    }
};

const getSportName = (booking: IBooking): string => {
    const sport = booking.details[0]?.court_id?.sport_center_id?.sport_id?.name;
    return sport ? sport.toLowerCase() : "";
};

export default function ProfilePage() {
    const { user, updateUserData, logout } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"profile" | "password" | "bookings">("profile");
    const [bookingFilter, setBookingFilter] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [sportFilter, setSportFilter] = useState<string>("all");

    // State cho form thông tin cá nhân
    const [name, setName] = useState(user?.name || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [profileSaving, setProfileSaving] = useState(false);

    // Đồng bộ form khi user được load từ AuthContext (bất đồng bộ)
    useEffect(() => {
        if (user) {
            Promise.resolve().then(() => {
                setName(user.name || "");
                setPhone(user.phone || "");
            });
        }
    }, [user]);

    // State cho form đổi mật khẩu
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [passwordSaving, setPasswordSaving] = useState(false);

    // State cho dữ liệu booking 
    const [bookings, setBookings] = useState<IBooking[]>([]);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingError, setBookingError] = useState<string | null>(null);
    const [selectedBooking, setSelectedBooking] = useState<IBooking | null>(null);

    // Fetch lịch sử đặt sân từ API
    useEffect(() => {
        if (activeTab !== "bookings") return;

        Promise.resolve()
            .then(() => {
                setBookings([]); // Reset dữ liệu khi chuyển tab
                return authedFetch(`${API_BASE_URL}/bookings/history`);
            })
            .then(async (res) => {
                if (!res.ok) {
                    throw new Error("Lỗi khi tải lịch sử đặt sân.");
                }
                const data = await res.json();
                if (data.success) {
                    setBookings(data.data);
                } else {
                    throw new Error(data.message || "Có lỗi xảy ra.");
                }
            })
            .catch((err: unknown) => {
                console.error(err);
                setBookingError(err instanceof Error ? err.message : "Có lỗi xảy ra.");
            })
            .finally(() => setBookingLoading(false));
    }, [activeTab]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?._id) {
            alert("Vui lòng đăng nhập để cập nhật thông tin.");
            return;
        }
        if (!name.trim()) {
            alert("Vui lòng nhập họ và tên.");
            return;
        }

        setProfileSaving(true);
        try {
            const res = await authedFetch(`${API_BASE_URL}/users/${user._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, phone })
            });

            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.message || data.error || "Cập nhật thông tin thất bại.");
            }

            alert("Cập nhật thông tin thành công!");
            // Cập nhật user trong context + localStorage
            updateUserData({ name: data.user?.name || name, phone: data.user?.phone || phone });
        } catch (err: unknown) {
            alert(err instanceof Error ? err.message : "Có lỗi xảy ra.");
        } finally {
            setProfileSaving(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?._id) {
            alert("Vui lòng đăng nhập để đổi mật khẩu.");
            return;
        }
        if (!currentPassword) {
            alert("Vui lòng nhập mật khẩu hiện tại.");
            return;
        }
        if (!newPassword || newPassword.length < 6) {
            alert("Mật khẩu mới phải có tối thiểu 6 ký tự.");
            return;
        }
        if (newPassword !== confirmNewPassword) {
            alert("Mật khẩu mới và xác nhận mật khẩu không khớp.");
            return;
        }

        setPasswordSaving(true);
        try {
            const res = await authedFetch(`${API_BASE_URL}/users/${user._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    current_password: currentPassword,
                    password: newPassword
                })
            });

            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.message || data.error || "Đổi mật khẩu thất bại.");
            }

            alert("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
            // Đăng xuất và chuyển về trang chủ sau khi đổi mật khẩu
            logout();
            router.push("/");
        } catch (err: unknown) {
            alert(err instanceof Error ? err.message : "Có lỗi xảy ra.");
        } finally {
            setPasswordSaving(false);
        }
    };

    const handleCancelBooking = async (bookingId: string) => {
        if (!window.confirm("Bạn có chắc chắn muốn hủy đơn đặt sân này?")) return;

        try {
            const res = await authedFetch(`${API_BASE_URL}/bookings/${bookingId}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ status: "CANCELLED" })
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => null);
                throw new Error(errData?.message || "Không thể hủy đơn đặt sân.");
            }

            const data = await res.json();
            if (data.success) {
                alert("Hủy đặt sân thành công!");
                // Cập nhật state cục bộ
                setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: "CANCELLED" } : b));
            } else {
                throw new Error(data.message || "Hủy đặt sân thất bại.");
            }
        } catch (err: unknown) {
            alert(err instanceof Error ? err.message : "Có lỗi xảy ra.");
        }
    };

    // Filter logic
    const filteredBookings = bookings.filter((booking) => {
        const statusKey = booking.status.toLowerCase();
        const matchesStatus = bookingFilter === "all" || statusKey === bookingFilter;

        const sportName = getSportName(booking);
        const matchesSport = sportFilter === "all" || sportName === sportFilter;

        const searchLower = searchQuery.toLowerCase();
        const code = booking._id ? booking._id.slice(-8).toUpperCase() : "";
        const centerName = booking.details[0]?.court_id?.sport_center_id?.name || "";
        const courtNames = booking.details.map(d => d.court_id?.court_name || "").join(", ");
        const address = booking.details[0]?.court_id?.sport_center_id?.address || "";

        const matchesSearch =
            code.toLowerCase().includes(searchLower) ||
            centerName.toLowerCase().includes(searchLower) ||
            courtNames.toLowerCase().includes(searchLower) ||
            address.toLowerCase().includes(searchLower);

        return matchesStatus && matchesSport && matchesSearch;
    });

    return (
        <div className="profile-container">
            <div className="profile-layout">

                <aside className="profile-sidebar">
                    <div className="profile-user-card">
                        <div className="profile-avatar-wrapper">
                            <img
                                alt="User Avatar"
                                className="profile-avatar"
                                src={user?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop"}
                            />
                        </div>
                        <h3 className="profile-user-name">{user?.name || "Khách hàng"}</h3>
                        <p className="profile-user-email">{user?.email || ""}</p>
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

                            <form id="profile-form" className="profile-form" onSubmit={handleUpdateProfile}>
                                <div className="form-group">
                                    <label className="form-label">Họ và tên</label>
                                    <input
                                        type="text"
                                        id="profile-name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
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
                                        value={user?.email || ""}
                                        disabled
                                        className="form-input disabled"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Số điện thoại</label>
                                    <input
                                        type="text"
                                        id="profile-phone"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        required
                                        className="form-input"
                                        placeholder="Nhập số điện thoại"
                                    />
                                </div>

                                <div className="form-actions">
                                    <button type="submit" id="save-profile-btn" className="btn btn-primary" disabled={profileSaving}>
                                        {profileSaving ? "Đang lưu..." : "Cập nhật thông tin"}
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

                            <form id="password-form" className="profile-form" onSubmit={handleChangePassword}>
                                <div className="form-group">
                                    <label className="form-label">Mật khẩu hiện tại</label>
                                    <input
                                        type="password"
                                        id="profile-current-password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
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
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
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
                                        value={confirmNewPassword}
                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                        placeholder="Xác nhận mật khẩu mới"
                                        required
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-actions">
                                    <button type="submit" id="save-password-btn" className="btn btn-primary" disabled={passwordSaving}>
                                        {passwordSaving ? "Đang lưu..." : "Thay đổi mật khẩu"}
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
                            {bookingLoading ? (
                                <div className="no-bookings-placeholder">
                                    <span className="material-symbols-outlined placeholder-icon">hourglass_top</span>
                                    <p>Đang tải lịch sử đặt sân...</p>
                                </div>
                            ) : bookingError ? (
                                <div className="no-bookings-placeholder">
                                    <span className="material-symbols-outlined placeholder-icon">error</span>
                                    <p>{bookingError}</p>
                                </div>
                            ) : filteredBookings.length > 0 ? (
                                filteredBookings.map((booking) => {
                                    const statusKey = booking.status.toLowerCase();
                                    const code = booking._id ? booking._id.slice(-8).toUpperCase() : "";
                                    const centerName = booking.details[0]?.court_id?.sport_center_id?.name || "Cụm sân";
                                    const courtNames = booking.details.map((d, i) =>
                                        i === 0 ? d.court_id?.court_name || "Sân" : d.court_id?.court_name || "Sân"
                                    ).join(", ");
                                    const address = booking.details[0]?.court_id?.sport_center_id?.address || "";
                                    const timeSlots = booking.details.map(d =>
                                        `${d.time_slot_id?.start_time || "--"}-${d.time_slot_id?.end_time || "--"}`
                                    ).join(", ");
                                    const paymentMethod = booking.payment_method;

                                    return (
                                        <div key={booking._id} className="booking-card" data-status={statusKey}>
                                            <div className="booking-card-body">
                                                <div className="booking-header">
                                                    <div className="booking-meta" >
                                                        <span className="booking-code">{code}</span>
                                                        <span className={`booking-badge status-${statusKey}`} style={{ backgroundColor: "#ffffff" }}>
                                                            {getStatusLabel(booking.status)}
                                                        </span>
                                                        <span className={`booking-badge ${getPaymentBadge(booking).className}`} style={{ backgroundColor: "#ffffff" }}>
                                                            {getPaymentBadge(booking).label}
                                                        </span>
                                                    </div>
                                                </div>
                                                <h4 className="booking-title">{centerName} - <span className="court-name">{courtNames}</span></h4>
                                                {address && (
                                                    <p className="booking-info address">
                                                        <span className="material-symbols-outlined">location_on</span> {address}
                                                    </p>
                                                )}
                                                <p className="booking-info datetime">
                                                    <span className="material-symbols-outlined">calendar_month</span> Ngày: <strong>{formatDateDisplay(booking.booking_for_date)}</strong> | Khung giờ: <strong>{timeSlots}</strong>
                                                </p>
                                                {booking.note && (
                                                    <p className="booking-note">Ghi chú: {booking.note}</p>
                                                )}
                                                {paymentMethod === 'payos' && booking.status === 'CANCELLED' && (
                                                    <p className="booking-note" style={{ color: '#92400e' }}>
                                                        Đơn đã hủy. Nếu bạn đã thanh toán, tiền sẽ được hoàn lại, vui lòng liên hệ với quản trị viên.
                                                    </p>
                                                )}
                                                {booking.services && booking.services.length > 0 && (
                                                    <p className="booking-info">
                                                        <span className="material-symbols-outlined">support</span> Dịch vụ: {booking.services.map(s => `${s.service_id?.service_name || "Dịch vụ"} x${s.quantity}`).join(", ")}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="booking-card-actions">
                                                <div className="booking-price-wrapper">
                                                    <span className="price-label">Tổng cộng</span>
                                                    <div className="booking-price">{formatPrice(booking.total_price)}</div>
                                                </div>
                                                <button
                                                    className="view-detail-btn"
                                                    onClick={() => setSelectedBooking(booking)}
                                                >
                                                    Xem chi tiết
                                                </button>
                                                {(booking.status === "PENDING" || booking.status === "CONFIRMED") && (
                                                    <button
                                                        className="cancel-booking-btn"
                                                        onClick={() => handleCancelBooking(booking._id)}
                                                    >
                                                        Hủy đặt sân
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
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

            {/* --- Modal Xem Chi Tiết Đặt Sân --- */}
            {
                selectedBooking && (
                    <div className="booking-modal-overlay" onClick={() => setSelectedBooking(null)}>
                        <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="booking-modal-header">
                                <h3 className="booking-modal-title">Chi Tiết Đặt Sân</h3>
                                <button className="booking-modal-close" onClick={() => setSelectedBooking(null)}>
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <div className="booking-modal-body">
                                {(() => {
                                    const b = selectedBooking;
                                    const statusKey = b.status.toLowerCase();
                                    const code = b._id ? b._id.slice(-8).toUpperCase() : "";
                                    const centerName = b.details[0]?.court_id?.sport_center_id?.name || "Cụm sân";
                                    const address = b.details[0]?.court_id?.sport_center_id?.address || "";
                                    const sportName = b.details[0]?.court_id?.sport_center_id?.sport_id?.name || "";

                                    return (
                                        <>
                                            {/* Mã & Trạng thái */}
                                            <div className="booking-modal-status-row">
                                                <div>
                                                    <span className="booking-modal-label">Mã đặt sân</span>
                                                    <div className="booking-modal-code">{code}</div>
                                                </div>
                                                <div className="booking-modal-badges">
                                                    <span className={`booking-badge status-${statusKey}`}>
                                                        {getStatusLabel(b.status)}
                                                    </span>
                                                    <span className={`booking-badge ${getPaymentBadge(b).className}`}>
                                                        {getPaymentBadge(b).label}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Cụm sân */}
                                            <div className="booking-modal-section">
                                                <h4 className="booking-modal-section-title">
                                                    <span className="material-symbols-outlined">stadium</span>
                                                    Thông tin sân
                                                </h4>
                                                <div className="booking-modal-info-grid">
                                                    <div className="booking-modal-info-item">
                                                        <span className="booking-modal-info-label">Cụm sân</span>
                                                        <span className="booking-modal-info-value">{centerName}</span>
                                                    </div>
                                                    {sportName && (
                                                        <div className="booking-modal-info-item">
                                                            <span className="booking-modal-info-label">Môn thể thao</span>
                                                            <span className="booking-modal-info-value">{sportName}</span>
                                                        </div>
                                                    )}
                                                    {address && (
                                                        <div className="booking-modal-info-item full">
                                                            <span className="booking-modal-info-label">Địa chỉ</span>
                                                            <span className="booking-modal-info-value">{address}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Chi tiết sân & giờ */}
                                            <div className="booking-modal-section">
                                                <h4 className="booking-modal-section-title">
                                                    <span className="material-symbols-outlined">event_available</span>
                                                    Chi tiết đặt sân
                                                </h4>
                                                <div className="booking-modal-date-info">
                                                    <span className="material-symbols-outlined">calendar_month</span>
                                                    <strong>Ngày chơi:</strong> {formatDateDisplay(b.booking_for_date)}
                                                </div>
                                                <div className="booking-modal-table">
                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                <th>Sân</th>
                                                                <th>Khung giờ</th>
                                                                <th>Giá</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {b.details.map((d, idx) => (
                                                                <tr key={idx}>
                                                                    <td>{d.court_id?.court_name || "—"}</td>
                                                                    <td>
                                                                        {d.time_slot_id?.start_time || "--"} - {d.time_slot_id?.end_time || "--"}
                                                                    </td>
                                                                    <td>{formatPrice(d.price_at_booking)}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>

                                            {/* Dịch vụ */}
                                            {b.services && b.services.length > 0 && (
                                                <div className="booking-modal-section">
                                                    <h4 className="booking-modal-section-title">
                                                        <span className="material-symbols-outlined">support</span>
                                                        Dịch vụ đi kèm
                                                    </h4>
                                                    <div className="booking-modal-table">
                                                        <table>
                                                            <thead>
                                                                <tr>
                                                                    <th>Dịch vụ</th>
                                                                    <th>Số lượng</th>
                                                                    <th>Giá</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {b.services.map((s, idx) => (
                                                                    <tr key={idx}>
                                                                        <td>{s.service_id?.service_name || "Dịch vụ"}</td>
                                                                        <td>x{s.quantity}</td>
                                                                        <td>{formatPrice(s.price_at_booking)}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Ghi chú */}
                                            {b.note && (
                                                <div className="booking-modal-section">
                                                    <h4 className="booking-modal-section-title">
                                                        <span className="material-symbols-outlined">notes</span>
                                                        Ghi chú
                                                    </h4>
                                                    <p className="booking-modal-note">{b.note}</p>
                                                </div>
                                            )}

                                            {/* Tổng tiền */}
                                            <div className="booking-modal-total">
                                                <div className="booking-modal-total-row">
                                                    <span>Tạm tính</span>
                                                    <span>{formatPrice(b.subtotal || b.total_price)}</span>
                                                </div>
                                                <div className="booking-modal-total-row final">
                                                    <span>Tổng cộng</span>
                                                    <span className="booking-modal-total-price">{formatPrice(b.total_price)}</span>
                                                </div>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
