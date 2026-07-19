export default function Banner() {
    return (
        <div>
            <section className="hero-section">
                <div className="hero-background">
                    <img alt="Sân tennis chuyên nghiệp" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUKI-Yb4eoVXRQjrn1ZUhRMQ2V4Ud70k4ZV9W_yGdcguWdts-UJek9LEw8Nkoq6JwqThvndi3f2eBgiRkMxO_dv_63RgwJYBVTUp5QIf01FHETArHf0_ORjtsRGwupmzPOFoEbdeWev7Fbdvu73DZy4haenuluhkcRO6QaRj6b0XYf6ZT4cNPgOWvtg4TJ7AyOSnj7nBiZBphjgjzpdxGbTHrRp_TnPooZp-rh-4uk0CoSmXdXbETNig" />
                    <div className="hero-overlay"></div>
                </div>
                <div className="hero-content">
                    <h1 className="hero-title">LÀM CHỦ MỌI TRẬN ĐẤU</h1>
                    <p className="hero-subtitle">Đặt sân Tennis, Cầu lông và Pickleball chuyên nghiệp chỉ trong vài giây. Đỉnh cao thi đấu bắt đầu từ sân chơi đúng tầm.</p>

                    <form className="hero-search-form">
                        <div className="search-field">
                            <label className="search-label">ĐỊA ĐIỂM</label>
                            <div className="input-with-icon">
                                <span className="material-symbols-outlined field-icon">location_on</span>
                                <input className="search-input" placeholder="Phường, Quận, Thành phố" type="text" />
                            </div>
                        </div>
                        <div className="search-field">
                            <label className="search-label">MÔN THỂ THAO</label>
                            <div className="input-with-icon">
                                <span className="material-symbols-outlined field-icon">sports_tennis</span>
                                <select className="search-select">
                                    <option value="">Tất cả</option>
                                    <option value="Tennis">Tennis</option>
                                    <option value="Cầu lông">Cầu lông</option>
                                    <option value="Pickleball">Pickleball</option>
                                </select>
                            </div>
                        </div>
                        <div className="search-field">
                            <label className="search-label">NGÀY ĐẶT</label>
                            <div className="input-with-icon">
                                <span className="material-symbols-outlined field-icon">calendar_today</span>
                                <input className="search-input" type="date" />
                            </div>
                        </div>
                        <button type="button" className="btn-search-submit">
                            <span className="material-symbols-outlined">search</span> TÌM SÂN NGAY
                        </button>
                    </form>
                </div>
            </section>

        </div>
    );
}
