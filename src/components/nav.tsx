export default function Nav() {
    return (
        <header className="header">
            <div className="header-container">
                <div className="logo-area">
                    <a href="/ ">
                        <img src="../../images/logo-courtify.png" alt="Courtify Logo" className="logo-img" />
                    </a>
                </div>
                <nav className="nav-menu">
                    <a href="/ " className="nav-item active">Trang chủ</a>
                    <a href="/courts" className="nav-item">Tìm sân</a>
                    <a href="/news" className="nav-item">Tin tức</a>
                    <a href="/contact" className="nav-item">Liên hệ</a>
                    <a href="/about" className="nav-item">Giới thiệu</a>
                </nav>
                <div className="header-actions">
                    <button className="action-btn" title="Tìm kiếm">
                        <span className="material-symbols-outlined">search</span>
                    </button>
                    <button className="action-btn cart-btn" title="Giỏ hàng">
                        <span className="material-symbols-outlined">shopping_cart</span>
                        <span className="cart-badge">1</span>
                    </button>
                    <a href="/login" className="btn-login">ĐĂNG NHẬP</a>
                </div>
            </div>
        </header>

    )
}