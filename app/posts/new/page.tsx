"use client";
import Link from "next/link";
import { useUser } from "@/components/UserContext";
import { useEffect, useState } from "react";
import { handleRequest } from "@/lib/auth-helpers/client";
import tempAvatar from "@/components/icons/user.png";
import Image from "next/image";
import { publishPost } from "@/lib/auth-helpers/server";
import { useRouter, useSearchParams } from "next/navigation";
import BackButton from "@/components/ui/BackButton/BackButton";

export default function PostNewPage() {
    let [postDisabled, setPostDisabled] = useState<boolean>(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const errorMessage = searchParams.get("status_description");
    //console.log(profile);

    useEffect(() => {
        if (errorMessage) {
            setPostDisabled(false);
        }
    }, [errorMessage]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPostDisabled(true);
        const formData = new FormData(e.currentTarget);
        const result = await publishPost(formData);
        router.push(result);
        setPostDisabled(false);
    };

    return (
        <main className=" flex flex-col gap-5 min-h-screen">
            <nav className="p-4 border-[var(--accent-light)] border-b">
                <BackButton />
            </nav>
            {errorMessage && (
                <p className="text-red-500 text-sm text-center">
                    {errorMessage}
                </p>
            )}
            <form
                className=" p-4 flex flex-col gap-4 w-full"
                onSubmit={(e) => handleSubmit(e)}
            >
                <div className="flex gap-4">
                    <div className="mt-2">
                        {/* <img
                            src={
                                profile.avatar_url ? profile.avatar_url : tempAvatar
                            }
                            alt=""
                        /> */}
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
                    className={`absolute top-4 right-4 border border-[var(--accent-light)] rounded-full  text-sm py-1 px-4 ${
                        postDisabled
                            ? "bg-[var(--background-alt)]"
                            : "bg-[var(--background-color)]"
                    }`}
                >
                    POST
                </button>
            </form>
        </main>
    );
}
