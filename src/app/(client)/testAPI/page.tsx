'use client'
import Link from "next/link";
import { useEffect, useState } from "react";

export interface IUser {
    _id?: string;
    name: string;
    email: string;
    phone?: string;
    avatar_url?: string;
    role: 'ADMIN' | 'CUSTOMER';
    status: 'ACTIVE' | 'INACTIVE' | 'BANNED';
}

export default function TestAPI() {
    const [users, setUsers] = useState<IUser[]>([]);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch("http://localhost:8000/api/users");
                const data = await res.json();
                console.log(data);
                setUsers(data.users);
            } catch (error) {
                console.error('Lỗi khi tải dữ liệu user:', error);
            }
        }
        fetchUsers()
    }, [])
    return (
        <div>
            <h1>Danh Sách Người Dùng:</h1>
            {/* <ul>
                {users.map(user => (
                    <>
                        <li key={user._id}>{user.name}</li>
                        <Link href={`/testAPI/${user._id}`} className="border">Xem chi tiết</Link>
                    </>
                ))}
            </ul> */}

        </div>
    );
}