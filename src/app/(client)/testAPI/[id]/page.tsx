'use client';
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
interface IUserDetail {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    avatar_url?: string;
    role: string;
    status: string;
}
export default function TestAPIDetail() {
    const params = useParams();

    const [detail, setDetail] = useState<IUserDetail | null>(null);

    useEffect(() => {
        const fetchUserDetail = async () => {
            try {
                const res = await fetch(
                    `http://localhost:8000/api/users/${params.id}`
                );

                if (!res.ok) {
                    throw new Error("Không tìm thấy user");
                }

                const data = await res.json();

                console.log(data);

                setDetail(data.user);
            } catch (error) {
                console.error("Lỗi rồi:", error);
            }
        };
        if (params.id) {
            fetchUserDetail();
        }
    }, [params.id]);

    if (!detail) {
        return <h2>Đang tải...</h2>;
    }

    return (
        <div>
            <h1>Chi tiết người dùng</h1>

            <p>Tên: {detail.name}</p>
            <p>Email: {detail.email}</p>
            <p>Số điện thoại: {detail.phone || "Chưa cập nhật"}</p>
            <p>Vai trò: {detail.role}</p>
            <p>Trạng thái: {detail.status}</p>
        </div>
    );
}
