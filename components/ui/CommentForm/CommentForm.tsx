"use client";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import defaultAvi from "@/components/icons/user.png";
import { useState, useEffect, Suspense } from "react";
import { handleRequest, handleRequestAlt } from "@/lib/auth-helpers/client";
import { postComment } from "@/lib/auth-helpers/server";

interface User {
    id: string;
    username: string;
    verified: boolean;
    full_name: string;
    avatar_url: string;
}
interface Post {
    id: string;
    content: string;
    created_at: string;
}

interface CommentFormProps {
    user: User;
    post: Post;
}

export default function CommentForm({ user, post }: CommentFormProps) {
    const [formattedTime, setFormattedTime] = useState<string>("");
    const [postDisabled, setPostDisabled] = useState<boolean>(false);
    const searchParams = useSearchParams();
    const errorMessage = searchParams.get("status_description");
    const router = useRouter();

    //console.log(errorMessage);

    useEffect(() => {
        if (errorMessage) {
            setPostDisabled(false);
        }
    }, [errorMessage]);

    useEffect(() => {
        const formatTime = (timestamp: string): string => {
            const postDate = new Date(timestamp);
            const currentDate = new Date();
            const timeDiff = currentDate.getTime() - postDate.getTime();

            // Convert time difference to hours and minutes
            const minutes = Math.floor(timeDiff / (1000 * 60));
            const hours = Math.floor(minutes / 60);
            if (minutes < 60) {
                return `${minutes}m`;
            } else if (hours < 24) {
                return `${hours}h`;
            } else {
                // Older than 24 hours, return month and day
                const options: Intl.DateTimeFormatOptions = {
                    month: "short",
                    day: "numeric",
                };
                return postDate.toLocaleDateString("en-US", options);
            }
        };

        setFormattedTime(formatTime(post.created_at));
    }, [post.created_at]);

    const handleProfileNav = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        e.preventDefault;
        router.push(`/profile/${user.username}`);
    };

    const avi = "/images/default-avatar.png";

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPostDisabled(true);
        const formData = new FormData(e.currentTarget);

        formData.set("username", user.username);
        formData.set("post_id", post.id);
        formData.set("target_user", user.id);
        // const result = await postComment(formData, currentPost);
        console.log(user.username);
        await handleRequestAlt(formData, postComment, router);
        // if (result === "Success") {
        //     router.push(`/posts/${user.username}/${post.id}`);
        // } else {
        //     router.push(result);
        // }
        setPostDisabled(true);
    };

    return (
        <div>
            <div className="flex flex-row pt-2 pr-4 pl-4 pb-8 gap-2">
                <div className="pt-0.5 w-12">
                    <button onClick={handleProfileNav}>
                        <Image
                            src={
                                avi === "/images/default-avatar.png"
                                    ? defaultAvi
                                    : avi
                            }
                            width={48}
                            height={48}
                            alt=""
                        />
                    </button>
                </div>
                <div className="flex flex-col flex-1 justify-center">
                    <div className="flex flex-row justify-between items-center max-w-full">
                        <div className="flex flex-row gap-2 items-center max-w-full overflow-hidden">
                            <button
                                onClick={handleProfileNav}
                                className="font-bold text-lg truncate max-w-[30%]" // Adjust width as needed
                            >
                                {user.full_name}
                            </button>
                            {user.verified && (
                                <span className="text-xs text-blue-600 flex items-center justify-center">
                                    ✓
                                </span>
                            )}
                            <p className="opacity-50 truncate max-w-[25%]">
                                {" "}
                                {/* Adjust width as needed */}@{user.username}
                            </p>
                            <p className="opacity-50">·</p>
                            <time
                                dateTime={post.created_at}
                                className="opacity-50 truncate max-w-[30%]" // Adjust width as needed
                            >
                                {formattedTime}
                            </time>
                        </div>
                    </div>
                    <p className="mb-4">{post.content}</p>
                    <div className="flex flex-row gap-2">
                        <p className="opacity-50">Replying to</p>
                        <p className="text-blue-600 ">@{user.username}</p>
                    </div>
                </div>
            </div>
            {errorMessage && (
                <p className="text-red-500 text-sm pl-20">{errorMessage}</p>
            )}
            <div className="flex flex-row pt-2 pr-4 pl-4 pb-2 gap-2">
                <div className="pt-0.5 w-12 min-w-12">
                    <button onClick={handleProfileNav}>
                        <Image
                            src={
                                avi === "/images/default-avatar.png"
                                    ? defaultAvi
                                    : avi
                            }
                            width={48}
                            height={48}
                            alt=""
                        />
                    </button>
                </div>
                <form
                    className="flex flex-col gap-4 w-full"
                    onSubmit={(e) => handleSubmit(e)}
                >
                    <div className="flex gap-4">
                        <textarea
                            id="content"
                            name="content"
                            rows={7}
                            placeholder="Post your reply"
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
            </div>
        </div>
    );
}
