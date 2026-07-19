import "./page.css"
export default function CourtPage() {
    return (
        <>
            <main className="search-page-shell">
                <nav className="breadcrumbs">
                    <a href="?">Trang chủ</a>
                    <span className="material-symbols-outlined">chevron_right</span>
                    <span className="active">Tìm sân</span>
                </nav>

                <div className="search-layout">
                    <aside className="filters-panel">
                        <div className="panel-header">
                            <h3><span className="material-symbols-outlined">filter_list</span> Bộ lọc</h3>
                            <button id="clear-filters-btn" type="button">Xóa tất cả</button>
                        </div>

                        <div className="filter-group">
                            <label>Địa điểm</label>
                            <div className="input-wrap">
                                <span className="material-symbols-outlined">location_on</span>
                                <input id="filter-location" type="text" placeholder="Thành phố, Quận..." />
                            </div>
                        </div>

                        <div className="filter-group">
                            <label>Danh mục môn thể thao</label>
                            <select id="filter-sport">
                                <option value="">Tất cả môn thể thao</option>
                                <option value="pickleball">Pickleball</option>
                                <option value="tennis">Tennis</option>
                                <option value="badminton">Cầu lông</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Giá cả (đ/giờ)</label>
                            <div className="price-row">
                                <input id="filter-price-min" type="number" placeholder="Từ" min="0" />
                                <input id="filter-price-max" type="number" placeholder="Đến" min="0" />
                            </div>
                        </div>

                        <button id="apply-filters-btn" className="apply-btn" type="button">
                            <span className="material-symbols-outlined">search</span> Lọc Sân
                        </button>
                    </aside>

                    <section className="results-panel">
                        <div className="toolbar">
                            <div className="results-count">Tìm thấy <span id="results-count">4</span> cụm sân phù hợp.</div>
                            <div className="sort-box">
                                <label >Sắp xếp</label>
                                <select id="sort-select">
                                    <option value="most-booked">Đặt nhiều nhất</option>
                                    <option value="newest">Mới nhất</option>
                                    <option value="price-low">Giá: Thấp - Cao</option>
                                    <option value="price-high">Giá: Cao - Thấp</option>
                                </select>
                            </div>
                        </div>

                        <div id="search-results-list" className="results-stack">
                            <article className="court-card horizontal-card">
                                <div className="court-image-box">
                                    <img src="https://images.unsplash.com/photo-1547347298-4074fc3086f0?q=80&w=900&auto=format&fit=crop" alt="Sân Pickleball" />
                                    <div className="image-badge sport-badge">Pickleball</div>
                                    <div className="image-badge booking-badge">
                                        <span className="material-symbols-outlined">local_fire_department</span>
                                        12 lần đặt
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="card-top">
                                        <h4>CLB Pickleball Phú Nhuận</h4>
                                        <div className="rating">
                                            <span className="material-symbols-outlined">star</span>
                                            <span>4.9</span>
                                        </div>
                                    </div>
                                    <p className="address">
                                        <span className="material-symbols-outlined">location_on</span>
                                        18A Phan Đăng Lưu, Phú Nhuận, TP.HCM
                                    </p>
                                    <div className="card-meta">
                                        <span>Gửi xe miễn phí</span>
                                        <span>Điều hòa</span>
                                        <span>Căng tin</span>
                                    </div>
                                    <div className="card-footer">
                                        <span className="price">Từ 80.000đ<span>/giờ</span></span>
                                        <div className="card-actions">
                                            <a href="/checkout" className="btn-book">ĐẶT SÂN</a>
                                        </div>
                                    </div>
                                </div>
                            </article>

                            <article className="court-card horizontal-card">
                                <div className="court-image-box">
                                    <img src="https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=900&auto=format&fit=crop" alt="Sân Tennis" />
                                    <div className="image-badge sport-badge">Tennis</div>
                                    <div className="image-badge booking-badge">
                                        <span className="material-symbols-outlined">local_fire_department</span>
                                        8 lần đặt
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="card-top">
                                        <h4>Sân Tennis Riverside</h4>
                                        <div className="rating">
                                            <span className="material-symbols-outlined">star</span>
                                            <span>4.8</span>
                                        </div>
                                    </div>
                                    <p className="address">
                                        <span className="material-symbols-outlined">location_on</span>
                                        12 Nguyễn Văn Cừ, Quận 1, TP.HCM
                                    </p>
                                    <div className="card-meta">
                                        <span>Sân cỏ nhân tạo</span>
                                        <span>Đồ uống</span>
                                        <span>Đặt trước</span>
                                    </div>
                                    <div className="card-footer">
                                        <span className="price">Từ 150.000đ<span>/giờ</span></span>
                                        <div className="card-actions">
                                            <a href="/checkout" className="btn-book">ĐẶT SÂN</a>
                                        </div>
                                    </div>
                                </div>
                            </article>

                            <article className="court-card horizontal-card">
                                <div className="court-image-box">
                                    <img src="https://images.unsplash.com/photo-1530915365347-e35b749a0381?q=80&w=900&auto=format&fit=crop" alt="Sân Cầu lông" />
                                    <div className="image-badge sport-badge">Cầu lông</div>
                                    <div className="image-badge booking-badge">
                                        <span className="material-symbols-outlined">local_fire_department</span>
                                        21 lần đặt
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="card-top">
                                        <h4>Badminton Hub Thủ Đức</h4>
                                        <div className="rating">
                                            <span className="material-symbols-outlined">star</span>
                                            <span>4.7</span>
                                        </div>
                                    </div>
                                    <p className="address">
                                        <span className="material-symbols-outlined">location_on</span>
                                        45 Võ Văn Ngân, Thủ Đức, TP.HCM
                                    </p>
                                    <div className="card-meta">
                                        <span>6 sân</span>
                                        <span>Phòng đổi đồ</span>
                                        <span>Chiếu sáng</span>
                                    </div>
                                    <div className="card-footer">
                                        <span className="price">Từ 90.000đ<span>/giờ</span></span>
                                        <div className="card-actions">
                                            <a href="/checkout" className="btn-book">ĐẶT SÂN</a>
                                        </div>
                                    </div>
                                </div>
                            </article>

                            <article className="court-card horizontal-card">
                                <div className="court-image-box">
                                    <img src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=900&auto=format&fit=crop" alt="Sân Pickleball khác" />
                                    <div className="image-badge sport-badge">Pickleball</div>
                                    <div className="image-badge booking-badge">
                                        <span className="material-symbols-outlined">local_fire_department</span>
                                        15 lần đặt
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="card-top">
                                        <h4>Center Court Quận 7</h4>
                                        <div className="rating">
                                            <span className="material-symbols-outlined">star</span>
                                            <span>4.6</span>
                                        </div>
                                    </div>
                                    <p className="address">
                                        <span className="material-symbols-outlined">location_on</span>
                                        88 Nguyễn Hữu Thọ, Quận 7, TP.HCM
                                    </p>
                                    <div className="card-meta">
                                        <span>Phòng chờ</span>
                                        <span>Wifi</span>
                                        <span>Đỗ xe</span>
                                    </div>
                                    <div className="card-footer">
                                        <span className="price">Từ 110.000đ<span>/giờ</span></span>
                                        <div className="card-actions">
                                            <a href="/checkout" className="btn-book">ĐẶT SÂN</a>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </div>

                        <nav className="pagination" aria-label="Phân trang kết quả">
                            <a className="page-nav" href="#" aria-label="Trang trước">‹</a>
                            <a className="page-item active" href="#">1</a>
                            <a className="page-item" href="#">2</a>
                            <a className="page-item" href="#">3</a>
                            <a className="page-item" href="#">4</a>
                            <a className="page-item" href="#">5</a>
                            <span className="page-dots">...</span>
                            <a className="page-item" href="#">8</a>
                            <a className="page-nav" href="#" aria-label="Trang sau">›</a>
                        </nav>
                    </section>
                </div>
            </main>


        </>
    );
}
