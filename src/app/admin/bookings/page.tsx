"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import "../page.css";
import { API_BASE_URL } from "@/config/env";
import { authedFetch } from "@/services/client/session";

interface IBookingDetail {
    court_id: {
        _id: string;
        court_name: string;
        sport_center_id?: {
            name: string;
            address: string;
        };
    };
    time_slot_id: {
        _id: string;
        start_time: string;
        end_time: string;
        is_peak_hour: boolean;
    };
    price_at_booking: number;
}

interface IBookingService {
    service_id: {
        _id: string;
        service_name: string;
        price: number;
    };
    quantity: number;
    price_at_booking: number;
}

interface IPaymentInfo {
    order_code?: number;
    payment_provider?: string;
    payment_status?: string;
    paid_amount?: number;
    paid_at?: string;
    refund_note?: string;
}

interface IBooking {
    _id: string;
    user_id: {
        _id: string;
        name: string;
        phone: string;
        email: string;
    };
    booking_for_date: string;
    subtotal: number;
    total_price: number;
    voucher_discount?: number;
    voucher_id?: {
        _id: string;
        code: string;
        discount_type?: string;
        discount_value?: number;
    } | null;
    payment_method: string;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
    note?: string;
    details: IBookingDetail[];
    services?: IBookingService[];
    payment?: IPaymentInfo | null;
    created_at: string;
}

// Helper to format date display from YYYY-MM-DD to DD/MM/YYYY
const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return "—";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
};

const formatPrice = (price: number) => {
    if (!price && price !== 0) return "0đ";
    return `${price.toLocaleString("vi-VN")}đ`;
};

const getPaymentStatusLabel = (status: string) => {
    switch (status) {
        case "PENDING": return "Chờ thanh toán";
        case "SUCCESS": return "Đã thanh toán";
        case "FAILED": return "Thất bại / Đã hủy";
        case "REFUND_PENDING": return "Đã hủy — chờ hoàn tiền";
        case "REFUNDED": return "Đã hoàn tiền";
        default: return status || "—";
    }
};

const getPaymentBadge = (b: IBooking) => {
    if (b.payment_method === "cash") return { label: "Tiền mặt", className: "cash" };
    const key = b.payment?.payment_status ?? "NONE";
    switch (key) {
        case "SUCCESS": return { label: "Đã thanh toán", className: "success" };
        case "REFUND_PENDING": return { label: "Chờ hoàn tiền", className: "refund-pending" };
        case "REFUNDED": return { label: "Đã hoàn tiền", className: "refunded" };
        case "FAILED": return { label: "Đã hủy", className: "failed" };
        default: return { label: "Chưa thanh toán", className: "pending" };
    }
};

export default function BookingsPage() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<IBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedBooking, setSelectedBooking] = useState<IBooking | null>(null);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("");
    const [sortOrder, setSortOrder] = useState("newest"); // "newest", "oldest", "price-desc", "price-asc"
    const [paymentStatusFilter, setPaymentStatusFilter] = useState("all"); // all | paid | unpaid | REFUND_PENDING | REFUNDED

    interface IConfirmDialog {
        title: string;
        message: string;
        tone: 'danger' | 'warning' | 'success';
        confirmLabel: string;
        details: { label: string; value: string }[];
        onConfirm: () => void;
    }
    const [confirmDialog, setConfirmDialog] = useState<IConfirmDialog | null>(null);

    interface IToast {
        type: 'success' | 'error' | 'warning';
        message: string;
    }
    const [toast, setToast] = useState<IToast | null>(null);

    useEffect(() => {
        Promise.resolve().then(() => {
            return authedFetch(`${API_BASE_URL}/bookings`);
        })
            .then(async (res) => {
                const data = await res.json().catch(() => null);
                if (!res.ok) {
                    const serverMsg = data?.message || data?.error || `HTTP ${res.status}`;
                    throw new Error(`Lỗi khi tải danh sách đặt sân: ${serverMsg}`);
                }
                if (data.success) {
                    setBookings(data.data);
                } else {
                    throw new Error(data.message || "Có lỗi xảy ra.");
                }
            })
            .catch((err: unknown) => {
                console.error(err);
                setError(err instanceof Error ? err.message : "Có lỗi xảy ra.");
            })
            .finally(() => setLoading(false));
    }, []);

    const showToast = (type: IToast['type'], message: string) => {
        setToast({ type, message });
        window.setTimeout(() => setToast(null), 4000);
    };

    const getBookingSummary = (b: IBooking) => {
        const centerName = b.details[0]?.court_id?.sport_center_id?.name || "—";
        const courtNames = b.details.map(d => d.court_id?.court_name || "—").join(", ");
        const timeSlots = b.details.map(d => `${d.time_slot_id?.start_time || "--"}-${d.time_slot_id?.end_time || "--"}`).join(", ");
        return [
            { label: "Mã đơn", value: b._id ? b._id.slice(-8).toUpperCase() : "—" },
            { label: "Khách hàng", value: b.user_id?.name || "—" },
            { label: "Cụm sân", value: centerName },
            { label: "Sân & giờ", value: `${courtNames} — ${timeSlots}` },
            { label: "Ngày chơi", value: formatDateDisplay(b.booking_for_date) },
            { label: "Voucher", value: b.voucher_id ? `${b.voucher_id.code} (giảm ${formatPrice(b.voucher_discount || 0)})` : "—" },
            { label: "Tổng tiền", value: formatPrice(b.total_price) },
        ];
    };

    // Mở hộp thoại xác nhận trước khi đổi trạng thái
    const handleUpdateStatus = (booking: IBooking, newStatus: IBooking['status']) => {
        const code = booking._id ? booking._id.slice(-8).toUpperCase() : "";
        const isPaidPayOS = booking.payment?.payment_provider === 'payOS' && booking.payment.payment_status === 'SUCCESS';

        if (newStatus === 'CANCELLED') {
            setConfirmDialog({
                title: isPaidPayOS ? "Hủy đơn đã thanh toán" : "Xác nhận hủy đơn",
                tone: isPaidPayOS ? 'danger' : 'warning',
                confirmLabel: "Hủy đơn",
                message: isPaidPayOS
                    ? `Khách đã thanh toán ${formatPrice(booking.payment?.paid_amount ?? booking.total_price)} qua PayOS (Mã giao dịch: ${booking.payment?.order_code ?? "—"}). Sau khi hủy, bạn PHẢI hoàn tiền thủ công trên my.payos.vn rồi xác nhận trên hệ thống.`
                    : `Bạn có chắc chắn muốn hủy đơn ${code}? Khung giờ đã đặt sẽ được mở ra ngay lập tức.`,
                details: getBookingSummary(booking),
                onConfirm: () => doUpdateStatus(booking, 'CANCELLED'),
            });
            return;
        }

        const titles: Record<string, string> = { CONFIRMED: "Duyệt đơn đặt sân", COMPLETED: "Hoàn thành đơn" };
        const labels: Record<string, string> = { CONFIRMED: "Duyệt đơn", COMPLETED: "Hoàn thành" };
        const msgs: Record<string, string> = {
            CONFIRMED: `Xác nhận duyệt đơn ${code} của ${booking.user_id?.name || "khách hàng"}?`,
            COMPLETED: `Xác nhận đơn ${code} đã hoàn thành?`,
        };

        setConfirmDialog({
            title: titles[newStatus] || "Cập nhật trạng thái",
            tone: newStatus === 'COMPLETED' ? 'success' : 'warning',
            confirmLabel: labels[newStatus] || "Cập nhật",
            message: msgs[newStatus] || `Xác nhận cập nhật trạng thái đơn ${code}?`,
            details: getBookingSummary(booking),
            onConfirm: () => doUpdateStatus(booking, newStatus),
        });
    };

    // Thực hiện cập nhật trạng thái
    const doUpdateStatus = async (booking: IBooking, newStatus: IBooking['status']) => {
        setConfirmDialog(null);
        try {
            const res = await authedFetch(`${API_BASE_URL}/bookings/${booking._id}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await res.json().catch(() => null);
            if (!res.ok || !data?.success) {
                throw new Error(data?.message || "Không thể cập nhật trạng thái đơn.");
            }

            if (newStatus === 'CANCELLED') {
                const paid = booking.payment?.payment_provider === 'payOS' && booking.payment.payment_status === 'SUCCESS';
                showToast(paid ? 'warning' : 'success',
                    paid
                        ? "Đã hủy đơn. Đừng quên hoàn tiền thủ công trên my.payos.vn và xác nhận!"
                        : "Đã hủy đơn thành công, khung giờ đã được nhả.");
            } else {
                showToast('success', newStatus === 'CONFIRMED' ? "Đã duyệt đơn thành công!" : "Đã cập nhật trạng thái!");
            }

            setBookings(prev => prev.map(b => b._id === booking._id ? { ...b, status: newStatus } : b));
            setSelectedBooking(prev => prev && prev._id === booking._id ? { ...prev, status: newStatus } : prev);
        } catch (err: unknown) {
            showToast('error', err instanceof Error ? err.message : "Có lỗi xảy ra.");
        }
    };

    // Mở hộp thoại xác nhận hoàn tiền
    const requestMarkRefunded = (booking: IBooking) => {
        const paymentInfo = booking.payment;
        if (!paymentInfo?.order_code) {
            showToast('error', "Không tìm thấy mã giao dịch thanh toán.");
            return;
        }
        const amount = paymentInfo.paid_amount ?? booking.total_price;

        setConfirmDialog({
            title: "Xác nhận đã hoàn tiền",
            tone: 'success',
            confirmLabel: "Đã hoàn tiền xong",
            message: `Bạn đã thực sự hoàn tiền ${formatPrice(amount)} cho khách trên my.payos.vn chưa? Hành động này đánh dấu giao dịch là ĐÃ HOÀN TIỀN và không thể hoàn tác.`,
            details: [
                ...getBookingSummary(booking),
                { label: "Trạng thái hiện tại", value: getPaymentStatusLabel(paymentInfo.payment_status || "") },
            ],
            onConfirm: () => doMarkRefunded(booking),
        });
    };

    // Thực hiện xác nhận đã hoàn tiền
    const doMarkRefunded = async (booking: IBooking) => {
        const paymentInfo = booking.payment;
        if (!paymentInfo?.order_code) return;
        setConfirmDialog(null);

        try {
            const res = await authedFetch(`${API_BASE_URL}/payments/mark-refunded/${paymentInfo.order_code}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });
            const data = await res.json().catch(() => null);
            if (!res.ok || !data?.success) {
                throw new Error(data?.message || "Xác nhận hoàn tiền thất bại.");
            }

            showToast('success', "Đã xác nhận hoàn tiền thành công!");
            const updatedPayment: IPaymentInfo = { ...paymentInfo, payment_status: 'REFUNDED' };
            setBookings(prev => prev.map(b => b._id === booking._id ? { ...b, payment: updatedPayment } : b));
            setSelectedBooking(prev => prev && prev._id === booking._id ? { ...prev, payment: updatedPayment } : prev);
        } catch (err: unknown) {
            showToast('error', err instanceof Error ? err.message : "Có lỗi xảy ra.");
        }
    };

    // Filter logic
    const filteredBookings = bookings.filter(b => {
        const customerName = b.user_id?.name || "";
        const customerPhone = b.user_id?.phone || "";
        const centerName = b.details[0]?.court_id?.sport_center_id?.name || "";
        const code = b._id ? b._id.slice(-8).toUpperCase() : "";

        const matchesSearch =
            customerName.toLowerCase().includes(search.toLowerCase()) ||
            customerPhone.includes(search) ||
            code.includes(search.toUpperCase()) ||
            centerName.toLowerCase().includes(search.toLowerCase());

        const matchesStatus = statusFilter === "all" || b.status.toLowerCase() === statusFilter.toLowerCase();
        const matchesDate = !dateFilter || b.booking_for_date === dateFilter;

        const paymentKey = b.payment?.payment_status ?? "NONE";
        const matchesPaymentStatus = paymentStatusFilter === "all" ? true
            : paymentStatusFilter === "paid" ? paymentKey === "SUCCESS"
                : paymentStatusFilter === "unpaid" ? (paymentKey === "PENDING" || paymentKey === "FAILED" || paymentKey === "NONE")
                    : paymentKey === paymentStatusFilter;

        return matchesSearch && matchesStatus && matchesDate && matchesPaymentStatus;
    });

    // Sort logic
    const sortedBookings = [...filteredBookings].sort((a, b) => {
        if (sortOrder === "newest") {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        if (sortOrder === "oldest") {
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        }
        if (sortOrder === "price-desc") {
            return b.total_price - a.total_price;
        }
        if (sortOrder === "price-asc") {
            return a.total_price - b.total_price;
        }
        return 0;
    });

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'PENDING':
                return { label: 'Chờ duyệt', className: 'pending' };
            case 'CONFIRMED':
                return { label: 'Đã duyệt', className: 'confirmed' };
            case 'CANCELLED':
                return { label: 'Đã hủy', className: 'cancelled' };
            case 'COMPLETED':
                return { label: 'Hoàn thành', className: 'completed' };
            default:
                return { label: status, className: 'default' };
        }
    };

    return (
        <>
            <header className="admin-topbar">
                <h1 className="admin-topbar-title">Quản lý Booking</h1>
                <div className="admin-topbar-right">
                    <span className="admin-topbar-role">{user?.name || "Admin"}</span>
                    <div className="admin-topbar-avatar">{user?.name?.slice(0, 1) || "A"}</div>
                </div>
            </header>

            <div className="admin-page-body">
                <div className="page-header">
                    <h3 className="table-card-title">Danh sách Đặt sân</h3>
                </div>

                {/* Filter and Search Bar with Sort dropdown */}
                <div className="filter-search-container" style={{ marginBottom: 28, display: "flex", gap: "16px", flexWrap: "wrap" }}>
                    <div className="search-input-wrapper" style={{ flex: "4", minWidth: "200px" }}>
                        <span className="material-symbols-outlined">search</span>
                        <input
                            type="text"
                            className="search-field"
                            placeholder="Tìm theo mã đặt sân, tên khách hàng, cụm sân..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>

                    <div style={{ flex: "2", minWidth: "120px" }}>
                        <input
                            type="date"
                            className="select-filter-field"
                            style={{ width: "100%", height: "42px" }}
                            value={dateFilter}
                            onChange={e => setDateFilter(e.target.value)}
                        />
                    </div>

                    <div style={{ flex: "2", minWidth: "140px" }}>
                        <select
                            className="select-filter-field"
                            value={sortOrder}
                            onChange={e => setSortOrder(e.target.value)}
                            style={{ height: "42px", width: "100%" }}
                        >
                            <option value="newest">Ngày đặt: Mới nhất</option>
                            <option value="oldest">Ngày đặt: Cũ nhất</option>
                            <option value="price-desc">Tổng tiền: Giảm dần</option>
                            <option value="price-asc">Tổng tiền: Tăng dần</option>
                        </select>
                    </div>

                    <div className="filter-select-wrapper" style={{ flex: "2", minWidth: "140px" }}>
                        <select
                            className="select-filter-field"
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            style={{ height: "42px" }}
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="pending">Chờ duyệt</option>
                            <option value="confirmed">Đã duyệt</option>
                            <option value="cancelled">Đã hủy</option>
                            <option value="completed">Đã hoàn thành</option>
                        </select>
                    </div>

                    <div className="filter-select-wrapper" style={{ flex: "2", minWidth: "160px" }}>
                        <select
                            className="select-filter-field"
                            value={paymentStatusFilter}
                            onChange={e => setPaymentStatusFilter(e.target.value)}
                            style={{ height: "42px" }}
                        >
                            <option value="all">Mọi trạng thái thanh toán</option>
                            <option value="paid">Đã thanh toán</option>
                            <option value="unpaid">Chưa thanh toán</option>
                            <option value="REFUND_PENDING">Chờ hoàn tiền</option>
                            <option value="REFUNDED">Đã hoàn tiền</option>
                        </select>
                    </div>
                </div>

                <div className="table-card">
                    <div className="table-scroll">
                        {loading ? (
                            <div style={{ textAlign: "center", padding: "40px", color: "#00236f" }}>
                                Đang tải danh sách đặt sân...
                            </div>
                        ) : error ? (
                            <div style={{ textAlign: "center", padding: "40px", color: "#dc2626" }}>
                                Lỗi: {error}
                            </div>
                        ) : (
                            <table className="owner-table">
                                <thead>
                                    <tr>
                                        <th>Mã</th>
                                        <th>Khách hàng</th>
                                        <th>Cụm sân</th>
                                        <th>Sân</th>
                                        <th>Ngày chơi</th>
                                        <th>Khung giờ</th>
                                        <th>Tổng tiền</th>
                                        <th>Thanh toán</th>
                                        <th>Trạng thái</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedBookings.length > 0 ? (
                                        sortedBookings.map(b => {
                                            const statusInfo = getStatusInfo(b.status);
                                            const centerName = b.details[0]?.court_id?.sport_center_id?.name || "—";
                                            const courtNames = b.details.map(d => d.court_id?.court_name || "—").join(", ");
                                            const timeSlots = b.details.map(d => `${d.time_slot_id?.start_time} - ${d.time_slot_id?.end_time}`).join(", ");
                                            const code = b._id ? b._id.slice(-8).toUpperCase() : "";

                                            return (
                                                <tr key={b._id}>
                                                    <td><strong style={{ color: "#00236f" }}>{code}</strong></td>
                                                    <td>
                                                        <div><strong>{b.user_id?.name || "Khách hàng"}</strong></div>
                                                        <div className="sub-text">{b.user_id?.phone || "—"}</div>
                                                    </td>
                                                    <td>{centerName}</td>
                                                    <td>{courtNames}</td>
                                                    <td>{formatDateDisplay(b.booking_for_date)}</td>
                                                    <td>{timeSlots}</td>
                                                    <td>
                                                        <strong>{b.total_price.toLocaleString('vi-VN')}đ</strong>
                                                        {b.voucher_id && (
                                                            <div className="sub-text" style={{ color: "#16a34a" }}>
                                                                Voucher: {b.voucher_id.code}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td><span className={`pay-badge pay-${getPaymentBadge(b).className}`}>{getPaymentBadge(b).label}</span></td>
                                                    <td><span className={`badge badge-${statusInfo.className}`}>{statusInfo.label}</span></td>
                                                    <td>
                                                        <div className="booking-action-cell">
                                                            <button className="booking-view-btn" onClick={() => setSelectedBooking(b)}>
                                                                <span className="material-symbols-outlined">visibility</span>
                                                                Xem chi tiết
                                                            </button>
                                                            {b.status === "PENDING" && (
                                                                <div className="booking-row-actions">
                                                                    <button className="action-btn approve" onClick={() => handleUpdateStatus(b, 'CONFIRMED')}>
                                                                        <span className="material-symbols-outlined">check</span> Duyệt
                                                                    </button>
                                                                    <button className="action-btn cancel" onClick={() => handleUpdateStatus(b, 'CANCELLED')}>
                                                                        <span className="material-symbols-outlined">close</span> Hủy
                                                                    </button>
                                                                </div>
                                                            )}
                                                            {b.status === "CONFIRMED" && (
                                                                <div className="booking-row-actions">
                                                                    <button className="action-btn complete" onClick={() => handleUpdateStatus(b, 'COMPLETED')}>
                                                                        <span className="material-symbols-outlined">task_alt</span> Hoàn tất
                                                                    </button>
                                                                    <button className="action-btn cancel" onClick={() => handleUpdateStatus(b, 'CANCELLED')}>
                                                                        <span className="material-symbols-outlined">close</span> Hủy
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={10} style={{ textAlign: "center", padding: "24px", color: "#6b7280" }}>
                                                Không tìm thấy booking nào phù hợp
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {/* ---  Xem Chi Tiết Đơn Hàng --- */}
            {selectedBooking && (
                <div className="booking-modal-overlay" onClick={() => setSelectedBooking(null)}>
                    <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="booking-modal-header">
                            <h3 className="booking-modal-title">Chi Tiết Đơn Hàng</h3>
                            <button className="booking-modal-close" onClick={() => setSelectedBooking(null)}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="booking-modal-body">
                            {(() => {
                                const b = selectedBooking;
                                const statusInfo = getStatusInfo(b.status);
                                const code = b._id ? b._id.slice(-8).toUpperCase() : "";
                                const centerName = b.details[0]?.court_id?.sport_center_id?.name || "Cụm sân";
                                const address = b.details[0]?.court_id?.sport_center_id?.address || "";

                                return (
                                    <>
                                        {/* Mã & Trạng thái */}
                                        <div className="booking-modal-status-row">
                                            <div>
                                                <span className="booking-modal-label">Mã đơn hàng</span>
                                                <div className="booking-modal-code">{code}</div>
                                            </div>
                                            <div className="booking-modal-badges">
                                                <span className={`booking-badge status-${statusInfo.className}`}>{statusInfo.label}</span>
                                                <span className={`booking-badge pay-${getPaymentBadge(b).className}`}>{getPaymentBadge(b).label}</span>
                                            </div>
                                        </div>

                                        {/* Khách hàng */}
                                        <div className="booking-modal-section">
                                            <h4 className="booking-modal-section-title">
                                                <span className="material-symbols-outlined">person</span>
                                                Khách hàng
                                            </h4>
                                            <div className="booking-modal-info-grid">
                                                <div className="booking-modal-info-item">
                                                    <span className="booking-modal-info-label">Họ tên</span>
                                                    <span className="booking-modal-info-value">{b.user_id?.name || "—"}</span>
                                                </div>
                                                <div className="booking-modal-info-item">
                                                    <span className="booking-modal-info-label">SĐT</span>
                                                    <span className="booking-modal-info-value">{b.user_id?.phone || "—"}</span>
                                                </div>
                                                <div className="booking-modal-info-item">
                                                    <span className="booking-modal-info-label">Email</span>
                                                    <span className="booking-modal-info-value">{b.user_id?.email || "—"}</span>
                                                </div>
                                                <div className="booking-modal-info-item">
                                                    <span className="booking-modal-info-label">Phương thức thanh toán</span>
                                                    <span className="booking-modal-info-value">
                                                        {b.payment_method === "cash" ? "Tiền mặt" : (b.payment_method === "payos" ? "Online Chuyển Khoản" : "Chưa thanh toán")}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Trạng thái thanh toán & hoàn tiền (payOS) */}
                                        {b.payment && b.payment.payment_provider === "payOS" && (
                                            <div className="booking-modal-section">
                                                <h4 className="booking-modal-section-title">
                                                    <span className="material-symbols-outlined">payments</span>
                                                    Thanh toán & hoàn tiền
                                                </h4>
                                                <div className="booking-modal-info-grid">
                                                    <div className="booking-modal-info-item">
                                                        <span className="booking-modal-info-label">Trạng thái</span>
                                                        <span className="booking-modal-info-value">{getPaymentStatusLabel(b.payment.payment_status || "")}</span>
                                                    </div>
                                                    <div className="booking-modal-info-item">
                                                        <span className="booking-modal-info-label">Mã giao dịch</span>
                                                        <span className="booking-modal-info-value">{b.payment.order_code || "—"}</span>
                                                    </div>
                                                    {b.payment.paid_amount != null && (
                                                        <div className="booking-modal-info-item">
                                                            <span className="booking-modal-info-label">Đã thanh toán</span>
                                                            <span className="booking-modal-info-value">{formatPrice(b.payment.paid_amount)}</span>
                                                        </div>
                                                    )}
                                                    {b.payment.refund_note && (
                                                        <div className="booking-modal-info-item full">
                                                            <span className="booking-modal-info-label">Ghi chú hoàn tiền</span>
                                                            <span className="booking-modal-info-value">{b.payment.refund_note}</span>
                                                        </div>
                                                    )}
                                                    {b.payment.payment_status === "REFUND_PENDING" && (
                                                        <div className="booking-modal-info-item full">
                                                            <button className="action-btn approve" onClick={() => requestMarkRefunded(b)}>
                                                                <span className="material-symbols-outlined">currency_exchange</span>
                                                                Xác nhận đã hoàn tiền thủ công
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

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

                                        {/* Thao tác trong modal */}
                                        {(b.status === "PENDING" || b.status === "CONFIRMED") && (
                                            <div className="booking-modal-actions">
                                                {b.status === "PENDING" && (
                                                    <button className="action-btn approve" onClick={() => handleUpdateStatus(b, 'CONFIRMED')}>
                                                        Duyệt đơn
                                                    </button>
                                                )}
                                                {b.status === "CONFIRMED" && (
                                                    <button className="action-btn complete" onClick={() => handleUpdateStatus(b, 'COMPLETED')}>
                                                        Hoàn tất
                                                    </button>
                                                )}
                                                <button className="action-btn cancel" onClick={() => handleUpdateStatus(b, 'CANCELLED')}>
                                                    Hủy đơn
                                                </button>
                                            </div>
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            )}

            {/* --- Hộp thoại xác nhận --- */}
            {confirmDialog && (
                <div className="cfm-overlay" onClick={() => setConfirmDialog(null)}>
                    <div className="cfm-dialog" onClick={(e) => e.stopPropagation()}>
                        <div className={`cfm-icon cfm-${confirmDialog.tone}`}>
                            <span className="material-symbols-outlined">
                                {confirmDialog.tone === 'success' ? 'verified' : confirmDialog.tone === 'danger' ? 'warning' : 'help'}
                            </span>
                        </div>
                        <h3 className="cfm-title">{confirmDialog.title}</h3>
                        <p className="cfm-message">{confirmDialog.message}</p>

                        {confirmDialog.details.length > 0 && (
                            <div className="cfm-details">
                                {confirmDialog.details.map((d, idx) => (
                                    <div className="cfm-detail-row" key={idx}>
                                        <span className="cfm-detail-label">{d.label}</span>
                                        <span className="cfm-detail-value">{d.value}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="cfm-actions">
                            <button className="cfm-btn cfm-btn-secondary" onClick={() => setConfirmDialog(null)}>Đóng</button>
                            <button className={`cfm-btn cfm-btn-${confirmDialog.tone}`} onClick={confirmDialog.onConfirm}>
                                {confirmDialog.confirmLabel}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Toast thông báo --- */}
            {toast && (
                <div className={`toast toast-${toast.type}`}>
                    <span className="material-symbols-outlined">
                        {toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info'}
                    </span>
                    <span>{toast.message}</span>
                    <button className="toast-close" onClick={() => setToast(null)}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
            )}

            <style jsx>{`
                /* --- Badge trạng thái thanh toán --- */
                .pay-badge {
                    display: inline-flex;
                    align-items: center;
                    padding: 4px 10px;
                    border-radius: 999px;
                    font-size: 12px;
                    font-weight: 600;
                    white-space: nowrap;
                }
                .pay-cash { background: #eef2ff; color: #4338ca; }
                .pay-success { background: #e8f7ef; color: #166534; }
                .pay-pending { background: #f1f5f9; color: #475569; }
                .pay-failed { background: #fdeaea; color: #b91c1c; }
                .pay-refund-pending { background: #fff7e6; color: #92400e; }
                .pay-refunded { background: #e0f2fe; color: #075985; }

                /* --- Hộp thoại xác nhận --- */
                .cfm-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 1000;
                    background: rgba(15, 23, 42, 0.55);
                    backdrop-filter: blur(3px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 16px;
                }
                .cfm-dialog {
                    width: 100%;
                    max-width: 470px;
                    background: #fff;
                    border-radius: 16px;
                    padding: 24px;
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
                    animation: cfm-in 0.18s ease-out;
                }
                @keyframes cfm-in {
                    from { opacity: 0; transform: translateY(12px) scale(0.98); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .cfm-icon {
                    width: 52px; height: 52px;
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    margin-bottom: 14px;
                    font-size: 26px;
                }
                .cfm-warning { background: #fef3c7; color: #b45309; }
                .cfm-danger { background: #fee2e2; color: #b91c1c; }
                .cfm-success { background: #d1fae5; color: #047857; }
                .cfm-title { font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 8px; }
                .cfm-message { font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 16px; }
                .cfm-details {
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 10px;
                    padding: 12px 14px;
                    margin-bottom: 18px;
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }
                .cfm-detail-row { display: flex; justify-content: space-between; gap: 12px; font-size: 13px; }
                .cfm-detail-label { color: #64748b; flex-shrink: 0; }
                .cfm-detail-value { color: #0f172a; font-weight: 600; text-align: right; }
                .cfm-actions { display: flex; justify-content: flex-end; gap: 10px; }
                .cfm-btn {
                    padding: 10px 18px;
                    border-radius: 10px;
                    font-size: 14px;
                    font-weight: 600;
                    border: none;
                    cursor: pointer;
                    transition: all 0.15s ease;
                }
                .cfm-btn-secondary { background: #f1f5f9; color: #334155; }
                .cfm-btn-secondary:hover { background: #e2e8f0; }
                .cfm-btn-warning { background: #f59e0b; color: #fff; }
                .cfm-btn-warning:hover { background: #d97706; }
                .cfm-btn-danger { background: #dc2626; color: #fff; }
                .cfm-btn-danger:hover { background: #b91c1c; }
                .cfm-btn-success { background: #10b981; color: #fff; }
                .cfm-btn-success:hover { background: #059669; }
            `}</style>
            <style jsx>{`
                /* --- Toast --- */
                .toast {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 1100;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 13px 16px;
                    border-radius: 12px;
                    font-size: 14px;
                    font-weight: 600;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18);
                    animation: toast-in 0.2s ease-out;
                    max-width: 380px;
                }
                @keyframes toast-in {
                    from { opacity: 0; transform: translateX(20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .toast-success { background: #065f46; color: #fff; }
                .toast-error { background: #991b1b; color: #fff; }
                .toast-warning { background: #92400e; color: #fff; }
                .toast-close {
                    background: none; border: none; color: inherit;
                    display: flex; align-items: center;
                    cursor: pointer; opacity: 0.8;
                    padding: 2px;
                }
                .toast-close:hover { opacity: 1; }
            `}</style>
        </>
    );
}