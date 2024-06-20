import Image from "next/image";
import Link from "next/link";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center gap-3 p-24">
            <h1 className="text-5xl">Chatter</h1>
            <Link href={"/login"} className="border border-black p-2">
                Login
            </Link>
            <Link href={"/signup"} className="border border-black p-2">
                Sign Up
            </Link>
            <Link href={"/home"}>Home</Link>
        </main>
    );
}
