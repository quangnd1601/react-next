'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Nếu chưa đăng nhập hoặc role không phải ADMIN -> Chuyển về trang đăng nhập
      if (!user || user.role !== 'ADMIN') {
        alert("Bạn không có quyền truy cập vào trang Admin!");
        router.push("/login");
      }
    }
  }, [user, loading, router]);

  // Trong lúc chờ khôi phục dữ liệu từ localStorage
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'sans-serif',
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#00236f'
      }}>
        Đang kiểm tra quyền truy cập Admin...
      </div>
    );
  }

  // Nếu không phải ADMIN thì không render giao diện Admin
  if (!user || user.role !== 'ADMIN') {
    return null;
  }

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
