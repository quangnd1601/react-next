import CourtItem from "@/components/courtItem";
import { ICourtNew } from "@/interface/courtNew";

interface CourtListProps {
    title: string;
    courtNew: ICourtNew[];
}

export default function CourtList({ title, courtNew }: CourtListProps) {
    return (
        <section className="court-section">
            <h2 className="court-title"> {title} </h2>
            <div className="court-list">
                <CourtItem courtNew={courtNew} />
            </div>
        </section>
    );
}