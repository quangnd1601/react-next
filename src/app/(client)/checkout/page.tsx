'use client';
import { useReducer, useEffect, useState, Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { clientCourtService, ICourtDetail, ITimeSlot } from "@/services/client/courtService";
import { clientCheckoutService } from "@/services/client/checkoutService";
import { ICheckoutState, CheckoutAction, IBookingData } from "@/interface/checkout";
import { ISportCenter } from "@/interface/sportCenter";
import { API_BASE_URL } from "@/config/env";
import "./page.css";
import Link from "next/link";

const initialState: ICheckoutState = {
    paymentMethod: 'cash',
    note: '',
    voucherCode: '',
    discount: 0,
    subtotal: 0,
    isSubmitting: false,
    error: null,
    successMessage: null,
};

function reducer(state: ICheckoutState, action: CheckoutAction): ICheckoutState {
    switch (action.type) {
        case 'SET_PAYMENT_METHOD':
            return { ...state, paymentMethod: action.payload };
        case 'SET_NOTE':
            return { ...state, note: action.payload };
        case 'SET_VOUCHER_CODE':
            return { ...state, voucherCode: action.payload };
        case 'APPLY_VOUCHER':
            return { ...state, discount: action.payload };
        case 'SET_SUBTOTAL':
            return { ...state, subtotal: action.payload };
        case 'SUBMIT_START':
            return { ...state, isSubmitting: true, error: null, successMessage: null };
        case 'SUBMIT_SUCCESS':
            return { ...state, isSubmitting: false, successMessage: action.payload };
        case 'SUBMIT_ERROR':
            return { ...state, isSubmitting: false, error: action.payload };
        default:
            return state;
    }
}

function CheckoutContent() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    const center_id = searchParams.get('center_id');
    const date = searchParams.get('date');

    const selectedPairs = useMemo(() => {
        const pairsParam = searchParams.get('pairs');
        if (pairsParam) {
            return pairsParam
                .split(',')
                .filter((p) => p.includes(':'))
                .map((p) => {
                    const [courtId, slotId] = p.split(':');
                    return { court_id: courtId, time_slot_id: slotId };
                });
        }

        const courtId = searchParams.get('court_id');
        const slotIds = searchParams.get('time_slot_id')?.split(',') || [];
        if (courtId && slotIds.length > 0) {
            return slotIds.map((slotId) => ({ court_id: courtId, time_slot_id: slotId }));
        }
        return [];
    }, [searchParams]);

    const [centerData, setCenterData] = useState<ISportCenter | null>(null);
    // Danh sách các mục đã chọn 
    const [selectedItems, setSelectedItems] = useState<Array<{ court: ICourtDetail; slot: ITimeSlot }>>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    // Thông báo áp voucher
    const [voucherMsg, setVoucherMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);
    // Mã voucher đã áp dụng thành công (được gửi lên backend để lưu vào đơn)
    const [appliedVoucherCode, setAppliedVoucherCode] = useState<string>("");


    useEffect(() => {
        const fetchBookingData = async () => {
            if (!center_id || !date || selectedPairs.length === 0) {
                setIsLoadingData(false);
                return;
            }

            try {
                const [center, courts, allSlots] = await Promise.all([
                    clientCourtService.getCenterDetail(center_id),
                    clientCourtService.getCourtsByCenter(center_id),
                    clientCourtService.getAllTimeSlots()
                ]);

                if (center) setCenterData(center);

                // Build danh sách các mục đã chọn (court + slot)
                const items = selectedPairs
                    .map(({ court_id: cid, time_slot_id: sid }) => {
                        const court = courts.find((c: ICourtDetail) => c._id === cid);
                        const slot = allSlots.find((s: ITimeSlot) => s._id === sid);
                        if (!court || !slot) return null;
                        return { court, slot };
                    })
                    .filter((item): item is { court: ICourtDetail; slot: ITimeSlot } => item !== null);

                setSelectedItems(items);

                // Calculate subtotal từ tất cả các mục
                if (items.length > 0) {
                    const defaultPrice = center?.default_price || 80000;
                    const total = items.reduce((sum, { court, slot }) => {
                        const price = slot.is_peak_hour && court.peak_price ? court.peak_price : (court.price || defaultPrice);
                        return sum + price;
                    }, 0);

                    dispatch({ type: 'SET_SUBTOTAL', payload: total });
                }

            } catch (error) {
                console.error("Lỗi lấy dữ liệu sân:", error);
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchBookingData();
    }, [center_id, date, selectedPairs]); // Thêm dependencies đầy đủ để tránh warning

    // Áp mã giảm giá: gọi API kiểm tra voucher + tính giảm đúng theo loại (% / cố định)
    const applyVoucher = async () => {
        const code = (state.voucherCode || "").trim();
        if (!code) {
            setAppliedVoucherCode("");
            setVoucherMsg({ text: "Vui lòng nhập mã voucher.", type: "error" });
            return;
        }
        try {
            const res = await fetch(`${API_BASE_URL}/vouchers/check/${encodeURIComponent(code)}`);
            const data = await res.json().catch(() => null);

            if (!res.ok || !data?.success || !data.data) {
                dispatch({ type: "APPLY_VOUCHER", payload: 0 });
                setAppliedVoucherCode("");
                setVoucherMsg({ text: data?.message || "Mã voucher không hợp lệ.", type: "error" });
                return;
            }
            const v = data.data;

            // Kiểm tra đơn tối thiểu
            if (state.subtotal < (v.min_order_value || 0)) {
                dispatch({ type: "APPLY_VOUCHER", payload: 0 });
                setAppliedVoucherCode("");
                setVoucherMsg({
                    text: `Đơn của bạn (${state.subtotal.toLocaleString("vi-VN")}đ) chưa đạt tối thiểu ${v.min_order_value.toLocaleString("vi-VN")}đ để dùng voucher này.`,
                    type: "error",
                });
                return;
            }

            // Tính số tiền giảm
            let discount = 0;
            if (v.discount_type === "PERCENTAGE") {
                discount = Math.round((state.subtotal * v.discount_value) / 100);
                if (v.max_discount_amount) discount = Math.min(discount, v.max_discount_amount);
            } else {
                // FIXED
                discount = v.discount_value;
                if (v.max_discount_amount) discount = Math.min(discount, v.max_discount_amount);
            }
            discount = Math.min(discount, state.subtotal); // không giảm quá tổng tiền
            discount = Math.max(0, discount);

            dispatch({ type: "APPLY_VOUCHER", payload: discount });
            setAppliedVoucherCode(v.code);
            setVoucherMsg({ text: `Đã áp dụng mã ${v.code}, bạn được giảm ${discount.toLocaleString("vi-VN")}đ.`, type: "success" });
        } catch (err) {
            console.error("Lỗi kiểm tra voucher:", err);
            dispatch({ type: "APPLY_VOUCHER", payload: 0 });
            setAppliedVoucherCode("");
            setVoucherMsg({ text: "Có lỗi khi kiểm tra voucher. Vui lòng thử lại.", type: "error" });
        }
    };

    const handleCheckout = async () => {
        if (!user) {
            alert("Vui lòng đăng nhập để thực hiện thanh toán.");
            const currentUrl = window.location.pathname + window.location.search;
            router.push(`/login?redirect=${encodeURIComponent(currentUrl)}`);
            return;
        }

        if (!centerData || selectedItems.length === 0 || !date) {
            dispatch({ type: 'SUBMIT_ERROR', payload: 'Dữ liệu đặt sân không hợp lệ. Vui lòng quay lại chọn sân.' });
            return;
        }

        dispatch({ type: 'SUBMIT_START' });

        try {
            const bookingData: IBookingData = {
                user_id: user._id as string,
                booking_for_date: date,
                total_price: state.subtotal - state.discount,
                details: selectedItems.map(({ court, slot }) => {
                    const price = slot.is_peak_hour && court.peak_price ? court.peak_price : (court.price || centerData.default_price || 0);
                    return {
                        court_id: court._id,
                        time_slot_id: slot._id,
                        price_at_booking: price
                    };
                }),
                services: [],
                note: state.note,
                payment_method: state.paymentMethod,
                voucher_code: appliedVoucherCode || undefined
            };

            const data = await clientCheckoutService.createBooking(bookingData);

            dispatch({ type: 'SUBMIT_SUCCESS', payload: data.message || 'Đặt sân thành công!' });

            // Lấy booking_id từ backend (mặc định rỗng nếu không có)
            const bookingId = data?.data?._id || '';

            // Nếu chọn thanh toán qua payOS → tạo link và chuyển tới trang thanh toán payOS
            if (state.paymentMethod === 'payos') {
                if (!bookingId) throw new Error('Không lấy được mã đơn. Vui lòng thử lại.');

                const paymentRes = await clientCheckoutService.createPaymentLink(bookingId);
                const checkoutUrl = paymentRes?.data?.checkoutUrl;
                if (!checkoutUrl) throw new Error('Không lấy được link thanh toán. Vui lòng thử lại.');

                window.location.href = checkoutUrl;
                return;
            }

            const pairsQuery = selectedItems
                .map(({ court, slot }) => `${court._id}:${slot._id}`)
                .join(',');

            // Chuyển sang trang thành công kèm dữ liệu để render
            const successUrl =
                `/checkout/success?center_id=${encodeURIComponent(center_id || '')}` +
                `&date=${encodeURIComponent(date || '')}` +
                `&pairs=${encodeURIComponent(pairsQuery)}` +
                `&total=${state.subtotal - state.discount}` +
                `&booking_id=${encodeURIComponent(bookingId)}` +
                `&payment_method=${encodeURIComponent(state.paymentMethod)}`;

            router.push(successUrl);
        } catch (error) {
            console.error("Checkout error:", error);
            const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi thanh toán.';
            dispatch({ type: 'SUBMIT_ERROR', payload: errorMessage });
        }
    };

    if (isLoadingData) {
        return <div style={{ padding: '50px', textAlign: 'center' }}>Đang tải thông tin đặt sân...</div>;
    }

    if (!centerData || selectedItems.length === 0) {
        return (
            <div style={{ padding: '50px', textAlign: 'center' }}>
                <h3>Không tìm thấy thông tin đặt sân hợp lệ!</h3>
                <button onClick={() => router.push('/courts')} className="btn btn-confirm" style={{ marginTop: '20px' }}>Quay lại tìm sân</button>
            </div>
        );
    }

    return (
        <main className="checkout-page">
            <nav className="breadcrumbs">
                <Link href="/">Trang chủ</Link>
                <span className="material-symbols-outlined">chevron_right</span>
                <Link href="/courts">Tìm sân</Link>
                <span className="material-symbols-outlined">chevron_right</span>
                <span className="active">Thanh toán</span>
            </nav>
            <section className="checkout-card">
                <div className="checkout-header">
                    <h1>Thanh toán đặt sân</h1>
                </div>

                {state.error && <div className="alert-error" style={{ color: 'red', padding: '10px', marginBottom: '10px', background: '#ffebee', borderRadius: '4px' }}>{state.error}</div>}
                {state.successMessage && <div className="alert-success" style={{ color: 'green', padding: '10px', marginBottom: '10px', background: '#e8f5e9', borderRadius: '4px' }}>{state.successMessage}</div>}

                <div className="checkout-layout">
                    <div className="left-column">
                        <div className="panel-box">
                            <h3>Thông tin đặt sân</h3>
                            <div className="booking-summary">
                                <div className="booking-item">
                                    <span>Cụm sân</span>
                                    <strong>{centerData.name}</strong>
                                </div>
                                <div className="booking-item">
                                    <span>Ngày</span>
                                    <strong>{new Date(date!).toLocaleDateString('vi-VN')}</strong>
                                </div>
                                <div className="booking-item" style={{ alignItems: 'flex-start' }}>
                                    <span>Sân & khung giờ ({selectedItems.length} mục)</span>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
                                        {selectedItems.map(({ court, slot }) => (
                                            <strong key={`${court._id}-${slot._id}`} style={{ textAlign: 'right' }}>
                                                {court.court_name}: {slot.start_time} - {slot.end_time}
                                                {slot.is_peak_hour && <span style={{ color: '#dc2626', fontSize: '12px', marginLeft: '4px' }}>(Giờ cao điểm)</span>}
                                            </strong>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="panel-box payment-panel">
                            <h3>Phương thức thanh toán</h3>
                            <div className="payment-options">
                                <label className={`payment-option ${state.paymentMethod === 'cash' ? 'active' : ''}`}>
                                    <input
                                        type="radio"
                                        name="payment_method"
                                        value="cash"
                                        checked={state.paymentMethod === 'cash'}
                                        onChange={(e) => dispatch({ type: 'SET_PAYMENT_METHOD', payload: e.target.value })}
                                    />
                                    <div>
                                        <strong>Tiền mặt</strong>
                                        <p>Thanh toán tại quầy</p>
                                    </div>
                                </label>
                                <label className={`payment-option ${state.paymentMethod === 'payos' ? 'active' : ''}`}>
                                    <input
                                        type="radio"
                                        name="payment_method"
                                        value="payos"
                                        checked={state.paymentMethod === 'payos'}
                                        onChange={(e) => dispatch({ type: 'SET_PAYMENT_METHOD', payload: e.target.value })}
                                    />
                                    <div>
                                        <strong>PayOS</strong>
                                        <p>Quét mã QR / chuyển khoản</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                        <div className="panel-box note-panel">
                            <h3>Ghi chú</h3>
                            <textarea
                                id="booking-note-input"
                                placeholder="Nhập ghi chú cho sân..."
                                value={state.note}
                                onChange={(e) => dispatch({ type: 'SET_NOTE', payload: e.target.value })}
                            ></textarea>
                        </div>
                    </div>

                    <div className="right-column">
                        <div className="summary-box">
                            <h3>Tóm tắt thanh toán</h3>
                            <div className="summary-row">
                                <span>Tạm tính</span>
                                <strong id="payment-subtotal">{state.subtotal.toLocaleString('vi-VN')}đ</strong>
                            </div>
                            {state.discount > 0 && (
                                <div className="summary-row discount-row" id="discount-row">
                                    <span>Giảm giá</span>
                                    <strong id="payment-discount">-{state.discount.toLocaleString('vi-VN')}đ</strong>
                                </div>
                            )}

                            <div className="summary-voucher">
                                <h4>Mã giảm giá</h4>
                                <div className="voucher-input-row">
                                    <input
                                        id="voucher-code-input"
                                        type="text"
                                        placeholder="Nhập mã voucher"
                                        value={state.voucherCode}
                                        onChange={(e) => dispatch({ type: 'SET_VOUCHER_CODE', payload: e.target.value })}
                                    />
                                    <button
                                        id="apply-voucher-btn"
                                        type="button"
                                        onClick={applyVoucher}
                                    >
                                        Áp dụng
                                    </button>
                                </div>
                                {voucherMsg && (
                                    <div id="voucher-message" className="voucher-message" style={{ marginTop: 8, fontSize: 13, color: voucherMsg.type === "success" ? "#10b981" : "#dc2626" }}>
                                        {voucherMsg.text}
                                    </div>
                                )}
                            </div>

                            <div className="summary-row total-row">
                                <span>Tổng tiền</span>
                                <strong id="payment-total">{Math.max(0, state.subtotal - state.discount).toLocaleString('vi-VN')}đ</strong>
                            </div>

                            <div className="action-row">
                                <button id="cancel-payment-btn" className="btn btn-cancel" type="button" onClick={() => router.back()}>Hủy</button>
                                <button
                                    className="btn btn-confirm"
                                    onClick={handleCheckout}
                                    disabled={state.isSubmitting}
                                >
                                    {state.isSubmitting ? 'Đang xử lý...' : 'Thanh toán'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div style={{ padding: '50px', textAlign: 'center' }}>Đang chuẩn bị trang thanh toán...</div>}>
            <CheckoutContent />
        </Suspense>
    );
}
