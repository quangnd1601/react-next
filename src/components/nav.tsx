'use client';

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Nav() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  // Trang menu đang active: "/" đúng tuyệt đối, các trang khác khớp theo prefix
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // Trạng thái ô tìm kiếm
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown menu / ô tìm kiếm khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Tìm kiếm: điều hướng sang trang /courts?search=<từ khóa>
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    setSearchOpen(false);
    setSearchQuery("");
    router.push(q ? `/courts?search=${encodeURIComponent(q)}` : "/courts");
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-area">
          <Link href="/">
            <img src="../../images/logo-courtify.png" alt="Courtify Logo" className="logo-img" />
          </Link>
        </div>
        <nav className="nav-menu">
          <Link href="/" className={`nav-item ${isActive("/") ? "active" : ""}`}>Trang chủ</Link>
          <Link href="/courts" className={`nav-item ${isActive("/courts") ? "active" : ""}`}>Tìm sân</Link>
          <Link href="/about" className={`nav-item ${isActive("/about") ? "active" : ""}`}>Giới thiệu</Link>
        </nav>
        <div className="header-actions">
          <button className="action-btn" title="Tìm kiếm" onClick={() => setSearchOpen(!searchOpen)}>
            <span className="material-symbols-outlined">search</span>
          </button>

          {searchOpen && (
            <div className="header-search-overlay" ref={searchRef}>
              <form className="header-search-form" onSubmit={handleSearchSubmit}>
                <span className="material-symbols-outlined">search</span>
                <input
                  autoFocus
                  type="text"
                  className="header-search-input"
                  placeholder="Tìm cụm sân, môn thể thao..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setSearchOpen(false);
                  }}
                />
                <button type="submit" className="header-search-submit">Tìm</button>
                <button type="button" className="header-search-close" title="Đóng" onClick={() => setSearchOpen(false)}>
                  <span className="material-symbols-outlined">close</span>
                </button>
              </form>
            </div>
          )}

          {user ? (
            <div className="user-dropdown-wrapper" ref={dropdownRef}>
              <button
                className="user-avatar-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                title={user.name || user.email}
              >
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.name} className="user-avatar-img" />
                ) : (
                  <div className="user-avatar-placeholder">
                    {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
              </button>

              {dropdownOpen && (
                <div className="user-dropdown-menu">
                  <div className="user-dropdown-header">
                    <span className="user-display-name">{user.name}</span>
                    <span className="user-display-email">{user.email}</span>
                  </div>
                  <hr className="dropdown-divider" />
                  <Link
                    href="/profile"
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <span className="material-symbols-outlined">person</span>
                    Thông tin cá nhân
                  </Link>
                  {user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <span className="material-symbols-outlined">dashboard</span>
                      Trang quản trị (Admin)
                    </Link>
                  )}
                  <hr className="dropdown-divider" />
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    className="dropdown-item logout-btn"
                  >
                    <span className="material-symbols-outlined">logout</span>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="btn-login">ĐĂNG NHẬP</Link>
          )}
        </div>
      </div>
    </header>
  );
}