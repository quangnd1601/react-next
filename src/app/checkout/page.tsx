import "./page.css"

export default function CheckoutPage() {
    return (
        <main className="checkout-page">
            <nav className="breadcrumbs">
                <a href="?">Trang chủ</a>
                <span className="material-symbols-outlined">chevron_right</span>
                <a >Tìm sân</a>
                <span className="material-symbols-outlined">chevron_right</span>
                <a className="active">Thanh toán</a>
            </nav>
            <section className="checkout-card">
                <div className="checkout-header">
                    <h1>Thanh toán đặt sân</h1>
                </div>

                <div className="checkout-layout">
                    <div className="left-column">
                        <div className="panel-box">
                            <h3>Thông tin đặt sân</h3>
                            <div className="booking-summary">
                                <div className="booking-item">
                                    <span>Cụm sân</span>
                                    <strong>CLB Pickleball Phú Nhuận</strong>
                                </div>
                                <div className="booking-item">
                                    <span>Sân</span>
                                    <strong>Sân 1</strong>
                                </div>
                                <div className="booking-item">
                                    <span>Ngày</span>
                                    <strong>19/07/2026</strong>
                                </div>
                                <div className="booking-item">
                                    <span>Khung giờ</span>
                                    <strong>18:00 - 20:00</strong>
                                </div>
                            </div>
                        </div>

                        <div className="panel-box payment-panel">
                            <h3>Phương thức thanh toán</h3>
                            <div className="payment-options">
                                <label className="payment-option active">
                                    <input type="radio" name="payment_method" value="cash" defaultChecked={true} />
                                    <div>
                                        <strong>Tiền mặt</strong>
                                        <p>Thanh toán tại quầy</p>
                                    </div>
                                </label>
                                <label className="payment-option">
                                    <input type="radio" name="payment_method" value="momo" />
                                    <div>
                                        <strong>Ví Momo</strong>
                                        <p>Quét mã QR online</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                        <div className="panel-box note-panel">
                            <h3>Ghi chú</h3>
                            <textarea id="booking-note-input" placeholder="Nhập ghi chú cho sân..."></textarea>
                        </div>

                    </div>

                    <div className="right-column">
                        <div className="summary-box">
                            <h3>Tóm tắt thanh toán</h3>
                            <div className="summary-row">
                                <span>Tạm tính</span>
                                <strong id="payment-subtotal">240.000đ</strong>
                            </div>
                            <div className="summary-row discount-row" id="discount-row">
                                <span>Giảm giá</span>
                                <strong id="payment-discount">-0đ</strong>
                            </div>

                            <div className="summary-voucher">
                                <h4>Mã giảm giá</h4>
                                <div className="voucher-input-row">
                                    <input id="voucher-code-input" type="text" placeholder="Nhập mã voucher" />
                                    <button id="apply-voucher-btn" type="button">Áp dụng</button>
                                </div>
                                <div id="voucher-message" className="voucher-message"></div>
                            </div>

                            <div className="summary-row total-row">
                                <span>Tổng tiền</span>
                                <strong id="payment-total">240.000đ</strong>
                            </div>

                            <div className="action-row">
                                <button id="cancel-payment-btn" className="btn btn-cancel" type="button">Hủy</button>
                                <a href="/checkout/success" className="btn btn-confirm">
                                    Thanh toán
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>

    );
}
