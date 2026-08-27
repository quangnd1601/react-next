import CourtItem from "@/components/courtItem";
import { ICourtNew } from "@/interface/courtNew";

interface FilterOption {
    value: string;
    label: string;
}

interface CourtListProps {
    title: string;
    courtNew: ICourtNew[];
    filterOptions?: FilterOption[];
    activeFilter?: string;
    onFilterChange?: (value: string) => void;
}

export default function CourtList({ title, courtNew, filterOptions, activeFilter, onFilterChange }: CourtListProps) {
    return (
        <section className="court-section">
            <div className="court-section-header">
                <h2 className="court-title"> {title} </h2>
                {filterOptions && filterOptions.length > 0 && (
                    <div className="court-filter-bar">
                        {filterOptions.map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                className={`court-filter-btn ${activeFilter === opt.value ? "active" : ""}`}
                                onClick={() => onFilterChange?.(opt.value)}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <div className="court-list">
                {courtNew.length > 0 ? (
                    <CourtItem courtNew={courtNew} />
                ) : (
                    <p className="court-empty">Không có cụm sân phù hợp với bộ lọc.</p>
                )}
            </div>
        </section>
    );
}