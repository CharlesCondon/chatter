import Navbar from "@/components/ui/Navbar/Navbar";
import { Suspense } from "react";

// app/posts/layout.tsx
export default function NewPostLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            {children}
            <Navbar activePage={"home"}></Navbar>
        </Suspense>
    );
}
