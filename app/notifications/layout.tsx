// app/posts/layout.tsx
import Navbar from "../../components/ui/Navbar/Navbar";
import Link from "next/link";

export default function NotifLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="flex flex-col gap-5 min-h-screen">
            {children}
            <Navbar></Navbar>
        </main>
    );
}
