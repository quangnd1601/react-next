'use client';

import { useState, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";

const LoginContent = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  const expired = searchParams.get("expired") === "1";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      alert("Đăng nhập thành công!");
      if (result.role === 'ADMIN') {
        router.push("/admin"); // Chuyển sang trang Admin
      } else if (redirectUrl) {
        router.push(redirectUrl); // Chuyển về trang cần redirect (ví dụ: Checkout)
      } else {
        router.push("/"); // Chuyển sang trang chủ Client
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Đăng nhập</h2>
        </div>
        {expired && (
          <div style={{
            marginBottom: "14px",
            padding: "10px 14px",
            borderRadius: "8px",
            background: "#fdeaea",
            color: "#b91c1c",
            border: "1px solid #fca5a5",
            fontSize: "14px",
            textAlign: "center"
          }}>
            Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để tiếp tục.
          </div>
        )}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email / Tên đăng nhập:</label>
            <div className="input-container">
              <span className="material-symbols-outlined input-icon">mail</span>
              <input
                type="text"
                placeholder="Tên đăng nhập / Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Mật khẩu:</label>
            <div className="input-container">
              <span className="material-symbols-outlined input-icon">lock</span>
              <input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
              />
            </div>
          </div>

          <button type="submit" className="btn-submit">Đăng nhập</button>
        </form>

        <div className="auth-footer">
          Chưa có tài khoản?{" "}
          <a href="/register" className="auth-link">Đăng ký ngay</a>
        </div>
      </div>
    </div>
  );
};

const LoginPage = () => {
  return (
    <Suspense fallback={<div style={{ padding: '50px', textAlign: 'center' }}>Đang tải...</div>}>
      <LoginContent />
    </Suspense>
  );
};

export default LoginPage;
