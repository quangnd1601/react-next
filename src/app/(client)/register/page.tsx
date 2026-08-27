"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_BASE_URL } from "@/config/env";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Mật khẩu và xác nhận mật khẩu không trùng khớp!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          confirm_password: confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Đăng ký tài khoản thành công! Vui lòng đăng nhập.");
        router.push("/login");
      } else {
        setErrorMessage(data.message || data.error || "Đăng ký thất bại!");
      }
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      setErrorMessage("Không thể kết nối đến máy chủ backend!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">ĐĂNG KÝ TÀI KHOẢN</h2>
        </div>

        {errorMessage && (
          <div style={{
            backgroundColor: "#fef2f2",
            color: "#dc2626",
            padding: "10px 14px",
            borderRadius: "8px",
            marginBottom: "16px",
            fontSize: "14px",
            border: "1px solid #fecaca",
            textAlign: "center"
          }}>
            {errorMessage}
          </div>
        )}

        <form id="register-form" className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Họ và tên</label>
            <div className="input-container">
              <span className="material-symbols-outlined input-icon">person</span>
              <input
                id="register-name"
                type="text"
                required
                className="form-input"
                placeholder="Nguyễn Duy Quang"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="input-container">
              <span className="material-symbols-outlined input-icon">mail</span>
              <input
                id="register-email"
                type="email"
                required
                className="form-input"
                placeholder="name@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Số điện thoại</label>
            <div className="input-container">
              <span className="material-symbols-outlined input-icon">phone</span>
              <input
                id="register-phone"
                type="tel"
                required
                className="form-input"
                placeholder="0901234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Mật khẩu</label>
            <div className="input-container">
              <span className="material-symbols-outlined input-icon">lock</span>
              <input
                id="register-password"
                type="password"
                required
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Xác nhận mật khẩu</label>
            <div className="input-container">
              <span className="material-symbols-outlined input-icon">lock</span>
              <input
                id="register-confirm-password"
                type="password"
                required
                className="form-input"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Đang xử lý..." : "Đăng ký tài khoản"}
          </button>
        </form>

        <div className="auth-footer">
          Đã có tài khoản?{" "}
          <Link href="/login" className="auth-link">Đăng nhập ngay</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;