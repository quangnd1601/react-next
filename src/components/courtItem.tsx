import { ICourtNew } from "@/interface/courtNew";
import Link from "next/link";

export default function CourtItem({ courtNew }: { courtNew: ICourtNew[] }) {
    return (
        <>
            {courtNew.map((court) => (
                <div className="court-item" key={court.id}>
                    <Link href={`/courts/${court.id}`}>
                        <img src={court.thumbnail} alt={court.name} className="court-thumbnail" />
                    </Link>
                    <div className="court-content">
                        <div className="court-header">
                            <span className="sport-type"> Tennis </span>
                            {court.is_new && (<span className="badge-new">Mới</span>)}
                        </div>
                        <h3> {court.name} </h3>
                        <p className="address"> {court.address}</p>
                        <div className="court-info"><span>Đánh giá: {court.rating_avg}/5</span>
                            <span>|</span>
                            <span>{court.booking_count} Lượt đặt</span>
                        </div>
                        <div className="court-footer">
                            <span className="price">
                                Từ {court.min_price.toLocaleString("vi-VN")}đ/giờ
                            </span>
                            <Link href={`/court/${court.id}`} className="btn-book">
                                Đặt sân
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}