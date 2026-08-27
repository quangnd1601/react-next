'use client';

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { clientCourtService, ICourtDetail, ITimeSlot } from "@/services/client/courtService";
import { clientCheckoutService } from "@/services/client/checkoutService";
import "./page.css";

function SuccessContent() {
    const searchParams = useSearchParams();

    const center_id = searchParams.get('center_id');
    const date = searchParams.get('date');
    const totalParam = searchParams.get('total');
    const booking_id = searchParams.get('booking_id') || '';
    const paymentMethodParam = searchParams.get('payment_method') || 'cash';
    const orderCode = searchParams.get('orderCode'); // payOS gắn thêm khi redirect về

    // Phân tích các cặp "court_id:time_slot_id" từ URL
    const pairsParam = searchParams.get('pairs') || '';
    const pairs = pairsParam
        .split(',')
        .filter((p) => p.includes(':'))
        .map((p) => {
            const [courtId, slotId] = p.split(':');
            return { court_id: courtId, time_slot_id: slotId };
        });

    const [centerName, setCenterName] = useState<string>('');
    const [items, setItems] = useState<Array<{ court: ICourtDetail; slot: ITimeSlot }>>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Trạng thái thanh toán payOS (chỉ dùng khi quay về từ payOS)
    const [payStatus, setPayStatus] = useState<'idle' | 'checking' | 'success' | 'pending' | 'error'>('idle');
    const [payMessage, setPayMessage] = useState<string>('');

    useEffect(() => {
        const loadData = async () => {
            if (!center_id || pairs.length === 0) {
                setLoading(false);
                return;
            }
            try {
                const [center, courts, allSlots] = await Promise.all([
                    clientCourtService.getCenterDetail(center_id),
                    clientCourtService.getCourtsByCenter(center_id),
                    clientCourtService.getAllTimeSlots()
                ]);

                setCenterName(center?.name || '');

                const loadedItems = pairs
                    .map(({ court_id: cid, time_slot_id: sid }) => {
                        const court = courts.find((c) => c._id === cid);
                        const slot = allSlots.find((s) => s._id === sid);
                        if (!court || !slot) return null;
                        return { court, slot };
                    })
                    .filter((item): item is { court: ICourtDetail; slot: ITimeSlot } => item !== null);

                setItems(loadedItems);
            } catch (err: unknown) {
                console.error("Lỗi tải dữ liệu trang thành công:", err);
                setError("Không thể tải thông tin đơn đặt sân.");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [center_id, pairs]);

    // Kiểm tra trạng thái thanh toán payOS khi quay về từ payOS
    // (backend tự xác minh trạng thái thật với payOS — không tin query trên URL)
    useEffect(() => {
        if (!orderCode) return; // Luồng tiền mặt: không cần kiểm tra

        let cancelled = false;
        let attempts = 0;

        const check = async () => {
            try {
                const token = localStorage.getItem('access_token');
                if (!token) {
                    setPayStatus('error');
                    setPayMessage('Vui lòng đăng nhập lại để kiểm tra trạng thái thanh toán.');
                    return;
                }

                const res = await clientCheckoutService.getPaymentStatus(orderCode, token);
                const status = res?.data?.status;

                if (status === 'SUCCESS') {
                    setPayStatus('success');
                    setPayMessage('Thanh toán thành công! Đơn đặt sân của bạn đã được xác nhận.');
                    return;
                }
            } catch (err) {
                console.error("Lỗi kiểm tra trạng thái thanh toán:", err);
            }

            attempts += 1;
            if (!cancelled && attempts < 5) {
                setTimeout(check, 3000); // Poll nhẹ: 4-5 lần, mỗi 3 giây
            } else if (!cancelled) {
                setPayStatus('pending');
                setPayMessage('Giao dịch đang chờ xác nhận. Vui lòng kiểm tra trong Lịch sử đặt sân.');
            }
        };

        setPayStatus('checking');
        setPayMessage('Đang kiểm tra trạng thái thanh toán...');
        check();

        return () => { cancelled = true; };
    }, [orderCode]);



    const total = Number(totalParam) || 0;
    const displayOrderId = booking_id ? booking_id.slice(-8).toUpperCase() : "";


    return (
        <main className="success-page">
            <section className="success-card">
                <div className="success-icon">✓</div>
                <h1>Đặt sân thành công</h1>
                <p className="success-subtitle">
                    Đơn đặt sân của bạn đã được ghi nhận. Vui lòng kiểm tra thông tin bên dưới.
                </p>

                {/* Banner trạng thái thanh toán payOS */}
                {orderCode && payStatus !== 'idle' && (
                    <div style={{
                        marginBottom: '16px',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        fontSize: '15px',
                        textAlign: 'left',
                        background: payStatus === 'success'
                            ? '#e8f7ef'
                            : (payStatus === 'error' ? '#fdeaea' : '#fff7e6'),
                        color: payStatus === 'success'
                            ? '#166534'
                            : (payStatus === 'error' ? '#b91c1c' : '#92400e'),
                        border: `1px solid ${payStatus === 'success'
                            ? '#86efac'
                            : (payStatus === 'error' ? '#fca5a5' : '#fcd34d')}`
                    }}>
                        {payMessage}
                    </div>
                )}

                {loading ? (
                    <p style={{ textAlign: 'center', padding: '20px', color: '#00236f' }}>Đang tải thông tin...</p>
                ) : error ? (
                    <p style={{ textAlign: 'center', padding: '20px', color: '#dc2626' }}>{error}</p>
                ) : (
                    <div className="success-order-box">
                        <div className="success-row">
                            <span>Mã đơn</span>
                            <strong>{displayOrderId}</strong>
                        </div>
                        <div className="success-row">
                            <span>Cụm sân</span>
                            <strong>{centerName || "—"}</strong>
                        </div>
                        <div className="success-row">
                            <span>Ngày</span>
                            <strong>{date ? new Date(date).toLocaleDateString('vi-VN') : "—"}</strong>
                        </div>
                        <div className="success-row">
                            <span>Sân & khung giờ</span>
                            <strong style={{ textAlign: 'right' }}>
                                {items.length > 0 ? (
                                    <span style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        {items.map(({ court, slot }) => (
                                            <span key={`${court._id}-${slot._id}`}>
                                                {court.court_name}: {slot.start_time} - {slot.end_time}
                                                {slot.is_peak_hour && <span style={{ color: '#dc2626', fontSize: '12px', marginLeft: '4px' }}>(Giờ cao điểm)</span>}
                                            </span>
                                        ))}
                                    </span>
                                ) : (
                                    "—"
                                )}
                            </strong>
                        </div>
                        <div className="success-row">
                            <span>Thanh toán bằng</span>
                            <strong>{paymentMethodParam === 'payos' ? 'PayOS (Quét mã QR)' : 'Tiền mặt'}</strong>
                        </div>
                        <div className="success-row total-row">
                            <span>Tổng tiền</span>
                            <strong>{total.toLocaleString('vi-VN')}đ</strong>
                        </div>
                    </div>
                )}

                <div className="success-actions">
                    <Link href="/" className="btn btn-secondary">
                        Về trang chủ
                    </Link>
                    <Link href="/courts" className="btn btn-primary">
                        Tìm sân khác
                    </Link>
                    <Link href="/profile" className="btn btn-secondary">
                        Lịch sử đặt sân
                    </Link>
                </div>
            </section>
        </main>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={<div style={{ padding: '50px', textAlign: 'center' }}>Đang chuẩn bị trang thành công...</div>}>
            <SuccessContent />
        </Suspense>
    );
}