// app/posts/layout.tsx
import Navbar from "@/components/ui/Navbar/Navbar";
import { UserProvider } from "@/components/UserContext";
export default function PostsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <UserProvider>
            <section>
                {children}
                <Navbar activePage={"profile"}></Navbar>
            </section>
        </UserProvider>
    );
}
