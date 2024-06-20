// app/posts/layout.tsx
import Navbar from "../../components/ui/Navbar";

export default function PostsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="flex flex-col gap-5 min-h-screen">
            <h1 className="text-center p-4">Chatter</h1>
            {children}
            <Navbar></Navbar>
        </main>
    );
}
