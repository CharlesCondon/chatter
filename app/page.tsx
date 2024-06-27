import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
    getAuthTypes,
    getViewTypes,
    getDefaultSignInView,
    getRedirectMethod,
} from "@/lib/auth-helpers/settings";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center gap-3 p-24">
            <h1 className="text-5xl">Chatter</h1>
            <Link
                href={"/signin/"}
                className="border border-black p-2 w-full text-center"
            >
                Login
            </Link>
            <Link
                href={"/signin/signup"}
                className="border border-black p-2 w-full text-center"
            >
                Sign Up
            </Link>
            {/* <Link href={"/home"}>Home</Link> */}
        </main>
    );
}
