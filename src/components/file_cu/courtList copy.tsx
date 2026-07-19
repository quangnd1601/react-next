import { ICourt } from "@/interface/court";
import CourtItem from "@/components/courtItem";

interface CourtListProps {
    title: string;
    courts: ICourt[];
}

export default function CourtList({ title, courts }: CourtListProps) {
    return (
        <section className="court-section">
            <h2 className="court-title"> {title} </h2>
            <div className="court-list">
                <CourtItem courts={courts} />
            </div>
        </section>
    );
}