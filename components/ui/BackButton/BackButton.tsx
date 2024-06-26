// components/BackButton.tsx
"use client"; // Mark this component as client-side

import { useRouter } from "next/navigation";

export default function BackButton() {
    const router = useRouter();

    return (
        <button onClick={() => router.back()} className="text-2xl">
            {"<"}-
        </button>
    );
}
