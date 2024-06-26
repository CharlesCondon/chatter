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
        <main className="flex min-h-screen flex-col items-center gap-3 p-20 pt-24 max-w-lg mx-auto">
            <h1 className="text-6xl">Chatter</h1>
            <div className="text-center">
                <p className="text-xl">A place for positivity</p>
                <p className="text-xs">(for Charles)</p>
            </div>

            <Link
                href={"/signin/"}
                className="border bg-[var(--accent-color)] p-2 w-full text-center text-[var(--background-color)] rounded"
            >
                Login
            </Link>
            <Link
                href={"/signin/signup"}
                className="border border-black bg-[var(--accent-color)] p-2 w-full text-center text-[var(--background-color)] rounded"
            >
                Sign Up
            </Link>
            {/* <Link href={"/home"}>Home</Link> */}
            <div className="fixed bottom-0 left-0 text-xs flex justify-between w-full px-2 py-1">
                <span>v.0.7</span>
                <span>
                    by:{" "}
                    <a
                        href={"https://www.charlescon.com/"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                    >
                        Charles Condon
                    </a>
                </span>
            </div>
        </main>
    );
}
