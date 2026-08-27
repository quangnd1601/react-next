'use client';

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import "../success/page.css";

function CancelContent() {
    const searchParams = useSearchParams();
    const paymentMethod = searchParams.get('payment_method') || 'payos';

    return (
        <main className="success-page">
            <section className="success-card">
                <div className="success-icon" style={{ background: '#f59e0b' }}>✕</div>
                <h1>Bạn đã hủy thanh toán</h1>
                <p className="success-subtitle">
                    {paymentMethod === 'payos'
                        ? 'Link thanh toán payOS của bạn đã bị hủy. Đơn đặt sân vẫn đang ở trạng thái chờ xác nhận.'
                        : 'Bạn đã hủy thanh toán. Đơn đặt sân vẫn đang ở trạng thái chờ xác nhận.'}
                </p>

                <div className="success-actions">
                    <Link href="/" className="btn btn-secondary">Về trang chủ</Link>
                    <Link href="/courts" className="btn btn-primary">Tìm sân khác</Link>
                    <Link href="/profile" className="btn btn-secondary">Lịch sử đặt sân</Link>
                </div>
            </section>
        </main>
    );
}

export default function CancelPage() {
    return (
        <Suspense fallback={<div style={{ padding: '50px', textAlign: 'center' }}>Đang tải...</div>}>
            <CancelContent />
        </Suspense>
    );
}
