"use client"
import { useState } from "react"
// form + state
// props: truyền data từ component cha xuống component con
// hook: useState: rerender layout khi giá trị thay đổi
// vd: cart, user
export default function LoginPage() {
  const [email, setEmail] = useState(""); // nếu muốn number thì useState<number>(0) hoặc useState<number | null>(null)
  const [password, setPassword] = useState("");
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">ĐĂNG NHẬP</h2>
        </div>
        <form id="login-form" className="auth-form">
          <div className="form-group">
            <label className="form-label" >Email của bạn:</label>
            <div className="input-container">
              <span className="material-symbols-outlined input-icon">mail</span>
              <input
                id="login-email"
                type="email"
                required
                placeholder="name@gmail.com"
                className="form-input"
                value={email} // giá trị của input = giá trị của state
                onChange={(e) => setEmail(e.target.value)} // cập nhật state khi người dùng nhập dữ liệu
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" >Mật khẩu</label>
            <div className="input-container">
              <span className="material-symbols-outlined input-icon">lock</span>
              <input
                id="login-password"
                type="password"
                required
                className="form-input"
                placeholder="••••••••"
                value={password} // giá trị của input = giá trị của state
                onChange={(e) => setPassword(e.target.value)} // cập nhật state khi người dùng nhập dữ liệu
              />
            </div>
          </div>

          <button type="submit" className="btn-submit">
            Đăng nhập
          </button>
        </form>

        <div className="auth-footer">
          Chưa có tài khoản?
          <a href="/register" className="auth-link">Đăng ký ngay</a>
        </div>
      </div>
    </div>
  )
}
