// app/posts/layout.tsx
import Navbar from "@/components/ui/Navbar/Navbar";
export default function PostsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section>
            {children}
            <Navbar></Navbar>
        </section>
    );
}
