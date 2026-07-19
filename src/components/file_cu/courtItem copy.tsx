import { ICourt } from "@/interface/court";
import Link from "next/link";

export default function CourtItem({ courts }: { courts: ICourt[] }) {
    return (
        <>
            {courts.map((court) => (
                <div className="court-item" key={court.id}>
                    <Link href={`/court/${court.id}`}>
                        <img src={court.thumbnail} alt={court.name} className="court-thumbnail" />
                    </Link>
                    <div className="court-content">
                        <div className="court-header">
                            <span className="sport-type"> {court.sport_type} </span>
                            {court.is_new && (<span className="badge-new">Mới</span>)}
                        </div>
                        <h3> {court.name}
                        </h3>
                        <p className="address">
                            {court.address}
                        </p>

                        <div className="court-info">
                            <span>
                                Đánh giá: {court.rating_avg}/5
                            </span>
                            <span>|</span>
                            <span>
                                {court.booking_count} Lượt đặt
                            </span>
                        </div>

                        <div className="court-footer">

                            <span className="price">
                                Từ {court.min_price.toLocaleString("vi-VN")}đ/giờ
                            </span>

                            <button className="btn-book">
                                Đặt sân
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}