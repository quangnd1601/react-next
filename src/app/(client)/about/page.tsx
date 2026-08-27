
import { API_BASE_URL } from "@/config/env";

const AboutPage = () => {
    console.log("check backend >>>>>>>", API_BASE_URL);

    return (
        <main className="about">
            {/* Hero */}
            <section className="hero">
                <div className="hero-text">
                    <span className="subtitle">
                        GIỚI THIỆU COURTIFY
                    </span>
                    <h1>
                        Nền tảng đặt sân thể thao trực tuyến hiện đại
                    </h1>
                    <p>
                        Courtify giúp người dùng dễ dàng tìm kiếm, so sánh và đặt sân
                        thể thao trực tuyến chỉ trong vài phút. Chúng tôi mong muốn
                        mang đến trải nghiệm đặt sân nhanh chóng, minh bạch và tiện lợi,
                        giúp người chơi tập trung tận hưởng niềm vui thể thao thay vì
                        mất thời gian tìm kiếm sân phù hợp.
                    </p>
                    <button className="btn">
                        Khám phá ngay
                    </button>
                </div>
                <div className="hero-image">
                    <img
                        src="https://plus.unsplash.com/premium_photo-1664303119944-4cf5302bb701?q=80&w=840&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Courtify"
                    />
                </div>
            </section>

            {/* Story */}
            <section className="story">

                <div className="story-image">
                    <img
                        src="https://images.unsplash.com/photo-1499510318569-1a3d67dc3976?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Câu chuyện Courtify"
                    />
                </div>

                <div className="story-content">

                    <h2>Câu chuyện của Courtify</h2>

                    <p>
                        Từ thực tế nhiều người gặp khó khăn khi tìm sân còn trống hoặc
                        phải liên hệ nhiều nơi để đặt lịch, Courtify được xây dựng nhằm
                        đơn giản hóa toàn bộ quá trình đặt sân. Chỉ với vài thao tác,
                        người dùng có thể lựa chọn môn thể thao, địa điểm, thời gian và
                        hoàn tất việc đặt sân ngay trên nền tảng.
                    </p>

                    <p>
                        Không chỉ dành cho người chơi, Courtify còn hỗ trợ các chủ sân
                        quản lý lịch đặt, giảm tình trạng trùng lịch và tiếp cận nhiều
                        khách hàng hơn. Chúng tôi hướng đến việc xây dựng một hệ sinh
                        thái kết nối giữa người chơi và các sân thể thao trên cùng một
                        nền tảng.
                    </p>

                </div>

            </section>

            {/* Mission */}
            <section className="mission">

                <div className="card">

                    <h3>Tầm nhìn</h3>

                    <p>
                        Trở thành nền tảng đặt sân thể thao trực tuyến được tin tưởng
                        hàng đầu tại Việt Nam, góp phần thúc đẩy phong trào rèn luyện
                        thể chất và xây dựng cộng đồng thể thao năng động.
                    </p>

                </div>

                <div className="card">

                    <h3>Sứ mệnh</h3>

                    <p>
                        Mang đến giải pháp đặt sân nhanh chóng, minh bạch và thuận tiện,
                        giúp người dùng dễ dàng tiếp cận các sân thể thao chất lượng
                        mọi lúc, mọi nơi.
                    </p>

                </div>

                <div className="card">

                    <h3>Giá trị cốt lõi</h3>

                    <p>
                        Lấy trải nghiệm người dùng làm trung tâm với các giá trị cốt lõi:
                        minh bạch thông tin, uy tín trong dịch vụ, đổi mới công nghệ và
                        không ngừng nâng cao chất lượng phục vụ.
                    </p>

                </div>

            </section>

            {/* Features */}
            <section className="features">

                <h2>Vì sao nên lựa chọn Courtify?</h2>

                <div className="feature-grid">

                    <div className="feature-card">

                        <img
                            src="https://images.unsplash.com/photo-1595435742656-5272d0b3fa82?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="Đặt sân nhanh chóng"
                        />

                        <h3>Đặt sân nhanh chóng</h3>

                        <p>
                            Chỉ với vài bước đơn giản, bạn có thể hoàn tất việc đặt sân
                            mà không cần gọi điện hay chờ xác nhận thủ công.
                        </p>

                    </div>

                    <div className="feature-card">

                        <img
                            src="https://plus.unsplash.com/premium_photo-1664304753883-923c28de6b85?q=80&w=736&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="Tìm kiếm thông minh"
                        />

                        <h3>Tìm kiếm thông minh</h3>

                        <p>
                            Dễ dàng lọc sân theo môn thể thao, khu vực, thời gian và mức
                            giá để tìm được lựa chọn phù hợp nhất.
                        </p>

                    </div>

                    <div className="feature-card">

                        <img
                            src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="Thông tin minh bạch"
                        />

                        <h3>Thông tin minh bạch</h3>

                        <p>
                            Cập nhật đầy đủ hình ảnh, bảng giá, tiện ích và đánh giá từ
                            người dùng giúp bạn yên tâm trước khi đặt sân.
                        </p>

                    </div>

                    <div className="feature-card">

                        <img
                            src="https://plus.unsplash.com/premium_photo-1663039984787-b11d7240f592?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="Hỗ trợ mọi lúc"
                        />

                        <h3>Hỗ trợ mọi lúc</h3>

                        <p>
                            Truy cập và đặt sân trực tuyến 24/7 trên mọi thiết bị, giúp
                            bạn chủ động sắp xếp lịch luyện tập bất cứ khi nào.
                        </p>

                    </div>

                </div>

            </section>

            {/* CTA */}
            <section className="cta">

                <h2>Sẵn sàng đồng hành cùng Courtify?</h2>

                <p>
                    Khám phá hệ thống sân thể thao chất lượng và trải nghiệm cách đặt sân
                    hiện đại, nhanh chóng và tiện lợi ngay hôm nay.
                </p>

                <button className="btn-white">
                    Bắt đầu ngay
                </button>

            </section>

        </main>
    );
};

export default AboutPage;