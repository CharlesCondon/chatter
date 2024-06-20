import Link from "next/link";

export default async function PostsPage() {
    return (
        <nav className="flex flex-row justify-between p-4 fixed bottom-0 w-screen border-black border-t">
            <Link href={"/home"}>Home</Link>
            <Link href={"/home"}>Explore</Link>
            <Link href={"/home"}>Notifs</Link>
            <Link href={"/home"}>DMs</Link>
            <Link href={"/profile"}>Profile</Link>
        </nav>
    );
}
