import Link from "next/link";
import "./page.css";

export default async function CheckoutSuccessPage() {

    return (
        <main className="success-page">
            <section className="success-card">
                <div className="success-icon">✓</div>
                <h1>Đặt sân thành công</h1>
                <p className="success-subtitle">
                    Đơn đặt sân của bạn đã được ghi nhận. Vui lòng kiểm tra thông tin bên dưới.
                </p>

                <div className="success-order-box">
                    <div className="success-row">
                        <span>Mã đơn</span>
                        <strong>#312312</strong>
                    </div>
                    <div className="success-row">
                        <span>Cụm sân</span>
                        <strong>CLB Pickleball Phú Nhuận</strong>
                    </div>
                    <div className="success-row">
                        <span>Sân</span>
                        <strong>Sân 1</strong>
                    </div>
                    <div className="success-row">
                        <span>Ngày</span>
                        <strong>19/07/2026</strong>
                    </div>
                    <div className="success-row">
                        <span>Khung giờ</span>
                        <strong>18:00 - 20:00</strong>
                    </div>
                    <div className="success-row total-row">
                        <span>Tổng tiền</span>
                        <strong>240.000đ</strong>
                    </div>
                </div>

                <div className="success-actions">
                    <Link href="/" className="btn btn-secondary">
                        Về trang chủ
                    </Link>
                    <Link href="/courts" className="btn btn-primary">
                        Tìm sân khác
                    </Link>
                </div>
            </section>
        </main>
    );
}
