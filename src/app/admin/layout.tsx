import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Courtify | Admin Portal",
  description: "Trang quản trị hệ thống Courtify",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="admin-shell">
      <div className="admin-wrapper">

        {/* ── SIDEBAR ── */}
        <aside className="owner-sidebar">
          {/* Logo */}
          <div className="sidebar-logo">
            <Link href="/admin" className="sidebar-brand">
              <img src="/images/logo-courtify-am-ban.png" alt="Courtify Logo" style={{ height: "75px", marginLeft: "25px", display: "block" }} />
            </Link>
          </div>

          {/* Nav */}
          <nav className="sidebar-nav">
            <Link href="/admin" className="sidebar-link" data-key="dashboard">
              <span className="material-symbols-outlined">dashboard</span>
              Trang Chủ
            </Link>
            <Link href="/admin/centers" className="sidebar-link">
              <span className="material-symbols-outlined">stadium</span>
              Quản lý Cụm sân
            </Link>
            <Link href="/admin/courts" className="sidebar-link">
              <span className="material-symbols-outlined">sports_tennis</span>
              Quản lý Sân
            </Link>
            <Link href="/admin/bookings" className="sidebar-link">
              <span className="material-symbols-outlined">event_note</span>
              Quản lý Booking
            </Link>
            <Link href="/admin/vouchers" className="sidebar-link">
              <span className="material-symbols-outlined">confirmation_number</span>
              Quản lý Voucher
            </Link>
            <Link href="/admin/users" className="sidebar-link">
              <span className="material-symbols-outlined">group</span>
              Quản lý Người dùng
            </Link>
          </nav>

          <div className="sidebar-footer">
            <Link href="/" className="sidebar-back-link">
              <span className="material-symbols-outlined">arrow_back</span>
              Về trang chủ
            </Link>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className="admin-main">
          {children}
        </main>
      </div>
    </div>
  );
}
