"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
    const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter();

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/explore/search?q=${encodeURIComponent(searchTerm)}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className="flex w-full">
            <input
                name="search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search"
                className="border p-2 pl-4 flex-1 rounded-full"
            />
            {/* <button type="submit" className="bg-blue-500 text-white p-2 ml-2">
                Search
            </button> */}
        </form>
    );
}
