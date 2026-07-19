import { ICourtNew } from "@/interface/courtNew";
import CourtItem from "@/components/courtItem";

interface CourtListProps {
    title: string;
    courtNew: ICourtNew[];
}

export default function CourtListNew({ title, courtNew }: CourtListProps) {
    return (
        <section className="court-section">
            <h2 className="court-title"> {title} </h2>
            <div className="court-list">
                <CourtItem courtNew={courtNew} />
            </div>
        </section>
    );
}