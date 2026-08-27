"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Banner from "@/components/banner";
import CourtList from "@/components/courtList";
import { ICourtNew } from "@/interface/courtNew";
import { clientCourtService } from "@/services/client/courtService";

export default function Home() {
  const [popularCourts, setPopularCourts] = useState<ICourtNew[]>([]);
  const [mostViewedCourts, setMostViewedCourts] = useState<ICourtNew[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // Bộ lọc môn thể thao RIÊNG cho từng danh sách (chọn danh sách nào chỉ lọc danh sách đó)
  const [popularSport, setPopularSport] = useState<string>("all");
  const [mostViewedSport, setMostViewedSport] = useState<string>("all");

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const data = await clientCourtService.getHomeData(4, 4);
        // API trả về SportCenter[], card cũ dùng ICourtNew (các field tương thích) -> cast an toàn
        setPopularCourts((data.popularCenters as ICourtNew[]) || []);
        setMostViewedCourts((data.mostViewedCenters as ICourtNew[]) || []);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu trang chủ:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const filterOptions = [
    { value: "all", label: "Tất cả" },
    { value: "Tennis", label: "Tennis" },
    { value: "Cầu lông", label: "Cầu lông" },
    { value: "Pickleball", label: "Pickleball" },
  ];

  const filteredPopular = useMemo(
    () =>
      popularSport === "all"
        ? popularCourts
        : popularCourts.filter((c) => {
          const name = typeof c.sport_id === "object" ? c.sport_id?.name : c.sport_id;
          return (name || "").toLowerCase() === popularSport.toLowerCase();
        }),
    [popularSport, popularCourts]
  );

  const filteredMostViewed = useMemo(
    () =>
      mostViewedSport === "all"
        ? mostViewedCourts
        : mostViewedCourts.filter((c) => {
          const name = typeof c.sport_id === "object" ? c.sport_id?.name : c.sport_id;
          return (name || "").toLowerCase() === mostViewedSport.toLowerCase();
        }),
    [mostViewedSport, mostViewedCourts]
  );

  return (
    <>
      <Banner />

      {/* ===== Hardcode: Khám Phá Theo Môn Thể Thao ===== */}
      <section style={{ width: "100%", maxWidth: 1280, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h2 style={{ fontFamily: "var(--font-family-title)", fontSize: 28, fontWeight: 700, color: "#00236f", margin: 0 }}>
            Khám Phá Theo Môn Thể Thao
          </h2>
          <p style={{ color: "#6b7280", fontSize: 15, marginTop: 8 }}>
            Chọn môn yêu thích để bắt đầu hành trình
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          {[
            { name: "Cầu Lông", img: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800", desc: "Sân cầu lông đạt chuẩn, thảm cao cấp." },
            { name: "Tennis", img: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800", desc: "Sân tennis mặt cứng tiêu chuẩn quốc tế." },
            { name: "Pickleball", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800", desc: "Môn thể thao đang hot nhất hiện nay." },
          ].map((s) => (
            <Link
              key={s.name}
              href={`/courts?sport=${encodeURIComponent(s.name)}`}
              style={{ textDecoration: "none", borderRadius: 16, overflow: "hidden", position: "relative", display: "block", height: 180, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
            >
              <img src={s.img} alt={s.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0))" }} />
              <div style={{ position: "absolute", left: 16, bottom: 14 }}>
                <span style={{ color: "#fff", fontFamily: "var(--font-family-title)", fontSize: 20, fontWeight: 700, display: "block" }}>{s.name}</span>
                <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 13 }}>{s.desc}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", fontSize: "16px", color: "#00236f" }}>
          Đang tải danh sách sân...
        </div>
      ) : (
        <>
          <CourtList
            title="Sân Chơi Phổ Biến"
            courtNew={filteredPopular}
            filterOptions={filterOptions}
            activeFilter={popularSport}
            onFilterChange={setPopularSport}
          />

          {/* ===== Hardcode: Vì Sao Chọn Courtify? ===== */}
          <section style={{ width: "100%", maxWidth: 1280, margin: "0 auto", padding: "40px 24px" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <h2 style={{ fontFamily: "var(--font-family-title)", fontSize: 28, fontWeight: 700, color: "#00236f", margin: 0 }}>
                Vì Sao Chọn Courtify?
              </h2>
              <p style={{ color: "#6b7280", fontSize: 15, marginTop: 8 }}>
                Nền tảng đặt sân thể thao nhanh chóng, minh bạch và tiện lợi
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
              {[
                { icon: "schedule", title: "Đặt sân nhanh chóng", desc: "Chọn sân, chọn giờ và xác nhận chỉ trong vài phút." },
                { icon: "payments", title: "Thanh toán an toàn", desc: "Hỗ trợ PayOS quét mã QR hoặc thanh toán tiền mặt tại sân." },
                { icon: "sports_tennis", title: "Sân đạt chuẩn", desc: "Cầu lông, tennis, pickleball với chất lượng thi đấu tốt." },
                { icon: "support_agent", title: "Hỗ trợ 24/7", desc: "Đội ngũ hỗ trợ luôn sẵn sàng giải đáp mọi thắc mắc." },
              ].map((f) => (
                <div
                  key={f.title}
                  style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 16, padding: "24px 20px", textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 40, color: "#00236f" }}>{f.icon}</span>
                  <h3 style={{ fontFamily: "var(--font-family-title)", fontSize: 17, fontWeight: 600, color: "#1f2937", margin: "12px 0 8px" }}>{f.title}</h3>
                  <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.5, margin: 0 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <CourtList
            title="Sân Chơi Được Xem Nhiều Nhất"
            courtNew={filteredMostViewed}
            filterOptions={filterOptions}
            activeFilter={mostViewedSport}
            onFilterChange={setMostViewedSport}
          />

          {/* ===== Hardcode: Hướng Dẫn Đặt Sân ===== */}
          <section style={{ width: "100%", maxWidth: 1280, margin: "0 auto", padding: "40px 24px" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <h2 style={{ fontFamily: "var(--font-family-title)", fontSize: 28, fontWeight: 700, color: "#00236f", margin: 0 }}>
                Hướng Dẫn Đặt Sân
              </h2>
              <p style={{ color: "#6b7280", fontSize: 15, marginTop: 8 }}>
                Chỉ 3 bước đơn giản là có ngay sân tập luyện
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
              {[
                { step: "01", icon: "search", title: "Chọn sân", desc: "Tìm cụm sân phù hợp theo môn thể thao, địa điểm và giá cả." },
                { step: "02", icon: "calendar_month", title: "Chọn ngày & giờ", desc: "Chọn ngày chơi và khung giờ, hệ thống hiển thị sân còn trống." },
                { step: "03", icon: "task_alt", title: "Thanh toán & chơi", desc: "Thanh toán online qua PayOS hoặc tại quầy, đến sân đúng giờ là xong." },
              ].map((s) => (
                <div
                  key={s.step}
                  style={{ position: "relative", background: "#f8fafc", border: "1px solid #e5e7eb", borderRadius: 16, padding: "28px 24px" }}
                >
                  <span style={{ position: "absolute", top: 16, right: 20, fontFamily: "var(--font-family-title)", fontSize: 40, fontWeight: 700, color: "#0e1d61" }}>{s.step}</span>
                  <span className="material-symbols-outlined" style={{ fontSize: 36, color: "#00236f" }}>{s.icon}</span>
                  <h3 style={{ fontFamily: "var(--font-family-title)", fontSize: 17, fontWeight: 600, color: "#1f2937", margin: "12px 0 8px" }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.5, margin: 0 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* ===== Hardcode: Thống kê + CTA ===== */}
      <section style={{ background: "#eef2ff", marginTop: 20 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px", textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-family-title)", fontSize: 28, fontWeight: 700, color: "#00236f", margin: 0 }}>
            Sẵn Sàng Ra Sân?
          </h2>
          <p style={{ color: "#6b7280", fontSize: 15, marginTop: 8 }}>
            Đặt sân ngay hôm nay để không bỏ lỡ khung giờ yêu thích
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap", margin: "28px 0" }}>
            {[
              { n: "6+", l: "Cụm sân" },
              { n: "18", l: "Sân thi đấu" },
              { n: "3", l: "Môn thể thao" },
              { n: "24/7", l: "Hỗ trợ" },
            ].map((st) => (
              <div key={st.l}>
                <div style={{ fontFamily: "var(--font-family-title)", fontSize: 32, fontWeight: 700, color: "#00236f" }}>{st.n}</div>
                <div style={{ color: "#6b7280", fontSize: 13, marginTop: 2 }}>{st.l}</div>
              </div>
            ))}
          </div>
          <Link
            href="/courts"
            style={{ display: "inline-block", background: "#00236f", color: "#fff", fontWeight: 700, padding: "12px 28px", borderRadius: 999, fontSize: 15, textDecoration: "none" }}
          >
            Tìm Sân Ngay
          </Link>
        </div>
      </section>
    </>
  );
}