const LoginPage = () => {
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
                className="form-input"
                placeholder="name@gmail.com"
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
export default LoginPage