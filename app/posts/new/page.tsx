"use client";
import Link from "next/link";
import { useUser } from "@/components/UserContext";
import { useState } from "react";
import { handleRequest } from "@/lib/auth-helpers/client";
import tempAvatar from "@/components/icons/user.png";
import Image from "next/image";
import { publishPost } from "@/lib/auth-helpers/server";
import { useRouter } from "next/navigation";
import BackButton from "@/components/ui/BackButton/BackButton";

export default function PostNewPage() {
    const { profile } = useUser();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    //console.log(profile);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setIsSubmitting(true); // Disable the button while the request is being handled
        await handleRequest(e, publishPost, router);
        setIsSubmitting(false);
    };

    return (
        <main className="p-10 flex flex-col gap-5 min-h-screen">
            <div>
                <BackButton />
            </div>

            {/* <h1>{profile ? profile.full_name : ""}</h1>
            <h2>@{profile ? profile.username : ""}</h2> */}
            <form
                className="flex flex-col gap-4 w-full"
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
                <button className="border border-black rounded bg-white w-full py-2">
                    POST
                </button>
            </form>
        </main>
    );
}
