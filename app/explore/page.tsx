// app/explore/page.tsx

import BackButton from "@/components/ui/BackButton/BackButton";
import SearchBar from "@/components/ui/SearchBar/SearchBar";

export default async function Explore() {
    return (
        <div>
            <div className="flex gap-4 p-4 border-b border-[var(--accent-light)] bg-[var(--background-alt)] max-w-lg mx-auto">
                <BackButton />
                <SearchBar />
            </div>
        </div>
    );
}
