"use client";
import { useEffect, useState } from "react";
import { handleRequest } from "@/lib/auth-helpers/client";
import tempAvatar from "@/components/icons/user.png";
import Image from "next/image";
import { publishPost } from "@/lib/auth-helpers/server";
import { useRouter, useSearchParams } from "next/navigation";
import BackButton from "@/components/ui/BackButton/BackButton";

const DEBOUNCE_DELAY = 2000; // 2 seconds

export default function PostNewPage() {
    const [postDisabled, setPostDisabled] = useState<boolean>(false);
    const [submissionCount, setSubmissionCount] = useState<number>(0);
    const router = useRouter();
    const searchParams = useSearchParams();
    const errorMessage = searchParams.get("status_description");

    // Re-enable the button whenever there's an error or after a debounce period
    useEffect(() => {
        if (errorMessage) {
            setPostDisabled(false);
        }
    }, [errorMessage]); // Depend on submissionCount

    // Debounce to prevent rapid multiple submissions
    useEffect(() => {
        if (postDisabled) {
            const timer = setTimeout(() => {
                setPostDisabled(false);
            }, DEBOUNCE_DELAY);

            return () => clearTimeout(timer);
        }
    }, [postDisabled]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (postDisabled) return; // Prevent submission if button is disabled
        setPostDisabled(true);
        // Increment on each submission attempt
        await handleRequest(e, publishPost, router);
    };

    return (
        <main className="flex flex-col gap-5 min-h-screen">
            <nav className="p-4 border-[var(--accent-light)] border-b">
                <BackButton />
            </nav>
            {errorMessage && (
                <p className="text-red-500 text-sm text-center">
                    {errorMessage}
                </p>
            )}
            <form
                className="p-4 flex flex-col gap-4 w-full"
                onSubmit={(e) => handleSubmit(e)}
            >
                <div className="flex gap-4">
                    <div className="mt-2">
                        <Image src={tempAvatar} width={50} height={50} alt="" />
                    </div>
                    <textarea
                        id="content"
                        name="content"
                        rows={7}
                        placeholder="What's going on?"
                        className="resize-none flex-1 p-2 bg-transparent text-xl w-full focus-visible:outline-none"
                    ></textarea>
                </div>
                <button
                    disabled={postDisabled}
                    className={`absolute top-4 right-4 border border-[var(--accent-light)] rounded-full text-sm py-1 px-4 ${
                        postDisabled
                            ? "bg-[var(--background-alt)] cursor-not-allowed"
                            : "bg-[var(--accent-color)] text-[var(--background-color)]"
                    }`}
                >
                    POST
                </button>
            </form>
        </main>
    );
}
