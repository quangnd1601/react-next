import { API_BASE_URL } from "@/config/env";

/**
 * ============================================================
 * Quản lý phiên đăng nhập (session) tập trung
 * ============================================================
 * Khi access_token hết hạn, backend trả HTTP 401:
 *   { error: "Token không hợp lệ hoặc đã hết hạn: ..." }
 *
 * authedFetch() sẽ:
 *   1. Tự gắn Authorization: Bearer <access_token>
 *   2. Gặp 401 → tự refresh token 1 lần và thử lại request
 *   3. Refresh thất bại / token không tồn tại → coi như HẾT PHIÊN:
 *      - Xoá toàn bộ session
 *      - Chuyển về trang đăng nhập kèm thông báo "Phiên đã hết hạn"
 * ============================================================
 */

/** Xoá toàn bộ session (user + token) trong localStorage */
export function clearSession(): void {
  localStorage.removeItem("user");
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

/**
 * Xử lý khi phiên đăng nhập hết hạn:
 * - Xoá session
 * - Chuyển về /login?expired=1&redirect=<trang hiện tại>
 */
export function handleSessionExpired(): void {
  clearSession();
  const currentUrl = window.location.pathname + window.location.search;
  window.location.assign(`/login?expired=1&redirect=${encodeURIComponent(currentUrl)}`);
}

/** Gọi API refresh-token để lấy access_token mới, cập nhật vào localStorage */
export async function refreshAccessToken(): Promise<string | null> {
  const refresh_token = localStorage.getItem("refresh_token");
  if (!refresh_token) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/users/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token }),
    });
    if (!response.ok) return null;

    const data = await response.json();
    if (!data.access_token) return null;

    localStorage.setItem("access_token", data.access_token);
    if (data.refresh_token) localStorage.setItem("refresh_token", data.refresh_token);
    return data.access_token;
  } catch (error) {
    console.error("Lỗi refresh token:", error);
    return null;
  }
}

/**
 * Fetch có xác thực (thay thế fetch thủ công + Bearer token).
 * Tự xử lý token hết hạn như mô tả ở đầu file.
 */
export async function authedFetch(url: string, init?: RequestInit): Promise<Response> {
  const token = localStorage.getItem("access_token");
  if (!token) {
    // Chưa có token → coi như hết phiên, mời đăng nhập lại
    handleSessionExpired();
    throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
  }

  const doFetch = (authToken: string) =>
    fetch(url, {
      ...init,
      headers: { ...(init?.headers || {}), Authorization: `Bearer ${authToken}` },
    });

  let res = await doFetch(token);

  // Token hết hạn (401) → thử refresh 1 lần
  if (res.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      res = await doFetch(newToken);
    }
  }

  // Vẫn 401 → hết phiên thật sự
  if (res.status === 401) {
    handleSessionExpired();
    throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
  }

  return res;
}
