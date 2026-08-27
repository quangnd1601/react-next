# Courtify - Nền tảng đặt sân thể thao

Courtify là nền tảng giúp người dùng đặt sân thể thao (Tennis, Cầu lông, Pickleball) trực tuyến nhanh chóng. Frontend được xây dựng theo kiến trúc Next.js App Router + TypeScript, giao tiếp với Backend qua RESTful API.

## 🚀 Tính năng nổi bật
- **Tìm & đặt sân:** Tìm cụm sân theo môn thể thao, xem khung giờ trống, đặt lịch trong vài giây.
- **Thanh toán trực tuyến:** Tích hợp cổng thanh toán PayOS.
- **Xác thực bảo mật:** Đăng ký/đăng nhập bằng JWT, tự động refresh token.
- **Quản trị toàn diện:** Dashboard thống kê, quản lý cụm sân, sân, booking, voucher, người dùng.
- **Voucher khuyến mãi**

## 🛠️ Hướng dẫn cài đặt
1. **Yêu cầu môi trường**
   - Node.js >= 20
   - npm (đi kèm Node.js)

2. **Cài đặt các thư viện**
   ```
   npm install
   ```

3. **Cấu hình môi trường (QUAN TRỌNG)**
   Tạo file `.env` tại thư mục gốc và điền biến sau:

   - **`NEXT_PUBLIC_API_BASE_URL`** — URL gốc của Backend API (bắt buộc kèm `/api`).
     - Dev: `http://localhost:8000/api`
     - Production: `https://courtify-backend-fwe5.onrender.com/api`
   - ⚠️ Thiếu biến này ở production → **build lỗi ngay** (cố ý để tránh deploy sai).

4. **Chạy thử**
   ```
   npm run dev
   ```
   Mở http://localhost:3000

## 🔒 Bảo mật
- Không bao giờ commit file `.env` lên repository.
- Biến `NEXT_PUBLIC_*` là **giá trị công khai** — tuyệt đối không đặt secret (JWT, MONGODB_URI, API key...) vào biến này.

