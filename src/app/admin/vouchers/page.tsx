"use client";

import Link from "next/link";
import "../page.css";

export default function VouchersPage() {
    return (
        <>
            <header className="admin-topbar">
                <h1 className="admin-topbar-title">Quản lý Voucher</h1>
                <div className="admin-topbar-right">
                    <span className="admin-topbar-role">Administrator</span>
                    <div className="admin-topbar-avatar">A</div>
                </div>
            </header>

            <div className="admin-page-body">
                <div className="page-header">
                    <h3 className="table-card-title">Danh sách Chương trình khuyến mãi</h3>
                    <Link href="/admin/vouchers/add" className="btn-primary" style={{ textDecoration: "none" }}>
                        <span className="material-symbols-outlined">add</span> Thêm Voucher
                    </Link>
                </div>

                <div className="table-card">
                    <div className="table-scroll">
                        <table className="owner-table">
                            <thead>
                                <tr>
                                    <th>Mã code</th>
                                    <th>Mô tả chương trình</th>
                                    <th>Mức giảm</th>
                                    <th>Giảm tối đa</th>
                                    <th>Đơn hàng tối thiểu</th>
                                    <th>Hạn sử dụng</th>
                                    <th>Lượt sử dụng</th>
                                    <th>Trạng thái</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><span style={{ background: "#eff4ff", color: "#00236f", fontWeight: 700, fontSize: 12, padding: "3px 8px", borderRadius: 6 }}>SUMMER20</span></td>
                                    <td>Chương trình khuyến mãi giảm giá mùa hè 2026</td>
                                    <td><strong>20%</strong></td>
                                    <td>50.000đ</td>
                                    <td>200.000đ</td>
                                    <td style={{ fontSize: 12 }}>01/06/2026 – 31/08/2026</td>
                                    <td>12/100 lượt</td>
                                    <td><span className="badge badge-active">Hoạt động</span></td>
                                    <td>
                                        <div className="action-btns">
                                            <button className="action-btn edit" onClick={() => alert("Sửa")}>Sửa</button>
                                            <button className="action-btn cancel" onClick={() => alert("Xóa")}>Xóa</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td><span style={{ background: "#eff4ff", color: "#00236f", fontWeight: 700, fontSize: 12, padding: "3px 8px", borderRadius: 6 }}>NEW10</span></td>
                                    <td>Ưu đãi đặc quyền chào mừng khách hàng đăng ký mới</td>
                                    <td><strong>10%</strong></td>
                                    <td>30.000đ</td>
                                    <td>150.000đ</td>
                                    <td style={{ fontSize: 12 }}>01/01/2026 – 31/12/2026</td>
                                    <td>45/200 lượt</td>
                                    <td><span className="badge badge-active">Hoạt động</span></td>
                                    <td>
                                        <div className="action-btns">
                                            <button className="action-btn edit" onClick={() => alert("Sửa")}>Sửa</button>
                                            <button className="action-btn cancel" onClick={() => alert("Xóa")}>Xóa</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td><span style={{ background: "#eff4ff", color: "#00236f", fontWeight: 700, fontSize: 12, padding: "3px 8px", borderRadius: 6 }}>FLASH30</span></td>
                                    <td>Flash Sale giờ vàng cuối tuần siêu ưu đãi</td>
                                    <td><strong>30%</strong></td>
                                    <td>80.000đ</td>
                                    <td>300.000đ</td>
                                    <td style={{ fontSize: 12 }}>15/07/2026 – 20/07/2026</td>
                                    <td>30/30 lượt</td>
                                    <td><span className="badge badge-inactive">Không hoạt động</span></td>
                                    <td>
                                        <div className="action-btns">
                                            <button className="action-btn edit" onClick={() => alert("Sửa")}>Sửa</button>
                                            <button className="action-btn cancel" onClick={() => alert("Xóa")}>Xóa</button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
