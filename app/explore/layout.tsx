// app/explore/layout.tsx
import { UserProvider } from "@/components/UserContext";
import Navbar from "../../components/ui/Navbar/Navbar";
import Link from "next/link";

export default function ExploreLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <UserProvider>
            <main className="flex flex-col gap-5 min-h-screen">
                {/* <Link href={"/"}>
                <h1 className="text-center p-4">Chatter</h1>
            </Link> */}
                {children}
                <Navbar activePage={"explore"}></Navbar>
            </main>
        </UserProvider>
    );
}
