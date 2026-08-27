
export const API_BASE_URL: string = (() => {
  const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (envUrl) {
    return envUrl.replace(/\/+$/, "");
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "[config/env] Thiếu NEXT_PUBLIC_API_BASE_URL ở môi trường production. "
    );
  }

  return "http://localhost:8000/api";
})();
