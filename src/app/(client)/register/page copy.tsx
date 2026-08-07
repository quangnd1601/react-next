"use client"
import { useState } from "react";
const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(0);
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">ĐĂNG KÝ TÀI KHOẢN</h2>
        </div>

        <form id="register-form" className="auth-form">
          <div className="form-group">
            <label className="form-label" >Họ và tên</label>
            <div className="input-container">
              <span className="material-symbols-outlined input-icon">person</span>
              <input
                id="register-name"
                type="text"
                required
                className="form-input"
                placeholder="Nguyễn Văn A"
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
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" >Số điện thoại</label>
            <div className="input-container">
              <span className="material-symbols-outlined input-icon">phone</span>
              <input
                id="register-phone"
                type="tel"
                required
                className="form-input"
                placeholder="0901234567"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" >Mật khẩu</label>
            <div className="input-container">
              <span className="material-symbols-outlined input-icon">lock</span>
              <input
                id="register-password"
                type="password"
                required
                className="form-input"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" >Xác nhận mật khẩu</label>
            <div className="input-container">
              <span className="material-symbols-outlined input-icon">lock</span>
              <input
                id="register-confirm-password"
                type="password"
                required
                className="form-input"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button type="submit" className="btn-submit">
            Đăng ký tài khoản
          </button>
        </form>

        <div className="auth-footer">
          Đã có tài khoản?
          <a href="/login" className="auth-link">Đăng nhập ngay</a>
        </div>
      </div>
      <div>
        Họ và tên: {name}
        Email: {email}
        Số điện thoại: {phoneNumber}
        Mật Khẩu: {password}
        Xác Nhận mật khẩu: {rePassword}
      </div>
    </div>
  )
}
export default RegisterPage;