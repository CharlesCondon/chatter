import { Suspense } from "react";

// app/posts/layout.tsx
export default function SearchLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>;
}
