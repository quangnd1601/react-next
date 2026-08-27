import { ICourtNew } from "@/interface/courtNew";
import Link from "next/link";

export default function CourtItem({ courtNew }: { courtNew: ICourtNew[] }) {
    return (
        <>
            {courtNew.map((court) => {
                const courtId = court._id || "";
                return (
                    <div className="court-item" key={courtId}>
                        <Link href={`/courts/${courtId}`}>
                            <img
                                src={court.thumbnail || "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600"}
                                alt={court.name}
                                className="court-thumbnail"
                            />
                        </Link>
                        <div className="court-content">
                            <div className="court-header">
                                <span className="sport-type">
                                    {typeof court.sport_id === "object" ? court.sport_id?.name : "Thể thao"}
                                </span>
                                {court.is_new && <span className="badge-new">Mới</span>}
                            </div>
                            <h3>{court.name}</h3>
                            <p className="address">{court.address}</p>
                            <div className="court-info">
                                <span>Đánh giá: {court.average_rating || court.rating_avg ? `${court.average_rating || court.rating_avg}/5` : "Chưa có"}</span>
                                <span>|</span>
                                <span>{court.total_bookings || court.booking_count || 0} Lượt đặt</span>
                            </div>
                            <div className="court-footer">
                                <span className="price">
                                    Từ {(court.default_price || court.min_price || 0).toLocaleString("vi-VN")}đ/giờ
                                </span>
                                <Link href={`/courts/${courtId}`} className="btn-book">
                                    Đặt sân
                                </Link>
                            </div>
                        </div>
                    </div>
                );
            })}
        </>
    );
}