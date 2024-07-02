"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import defaultAvi from "@/components/icons/user.png";
import { useState, useEffect } from "react";
import commentImg from "@/components/icons/chat.png";
import likeImg from "@/components/icons/heart.png";
import likeImgAlt from "@/components/icons/heartAlt.png";
import shareImg from "@/components/icons/share.png";
import { likeUnlike } from "@/lib/auth-helpers/server";
import { useUser } from "@/components/UserContext";
import PostOptionsModal from "../PostOptionsModal/PostOptionsModal";

interface Props {
    display: string;
    user: string;
    user_id: string;
    time: string;
    content: string;
    avi: string;
    id: string;
    comment_count: number;
    likes: number;
    verified?: boolean;
    haveLiked: boolean;
}

export default function Post({
    display,
    user,
    user_id,
    time,
    content,
    avi,
    id,
    comment_count,
    likes,
    verified,
    haveLiked,
}: Props) {
    const [formattedTime, setFormattedTime] = useState<string>("");
    let [currentLikes, setCurrentLikes] = useState<number>(likes);
    let [didLike, setDidLike] = useState<boolean>(haveLiked);
    let [postOptions, setPostOptions] = useState<boolean>(false);
    let [allowNav, setAllowNav] = useState<boolean>(false);
    const router = useRouter();
    const currentUser = useUser().profile;

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

        setFormattedTime(formatTime(time));
    }, [time]);

    const navigateToPost = (e: React.MouseEvent<HTMLDivElement>) => {
        //console.log(e.currentTarget);
        if (comment_count === -1 || likes === -1) {
            return;
        } else {
            router.push(`/posts/${user}/${id}`);
        }
    };

    const handleComment = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        e.preventDefault();
        router.push(`/comment/${user}/${id}`);
        //alert("test btn");
    };

    const likePost = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        e.preventDefault();

        if (!didLike) {
            setCurrentLikes(currentLikes + 1);
            setDidLike(!didLike);
            const result = await likeUnlike(id, "like", user_id);
            // if (result !== "success") {
            //     setCurrentLikes(currentLikes - 1);
            // }
        } else {
            setCurrentLikes(currentLikes - 1);
            setDidLike(!didLike);
            const result = await likeUnlike(id, "unlike", user_id);
            // if (result !== "success") {
            //     setCurrentLikes(currentLikes + 1);
            // }
        }
    };

    const sharePost = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        e.preventDefault();
        alert("Feature coming soon!");
    };

    const handleProfileNav = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        e.preventDefault();
        router.push(`/profile/${user}`);
    };

    const handlePostOptions = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        e.preventDefault();
        //setPostOptions(!postOptions);
    };

    return (
        <div
            onClick={(e) => navigateToPost(e)}
            className={`relative z-0 flex flex-row pt-2 pr-4 pl-4 pb-2 border-b border-[var(--accent-light)] gap-2 ${
                comment_count === -1 || likes === -1 ? "" : "cursor-pointer"
            }`}
        >
            <div className="pt-0.5">
                <button onClick={handleProfileNav}>
                    <div className="w-14 h-14 rounded-full overflow-hidden">
                        <Image
                            src={
                                avi === "/images/default-avatar.png"
                                    ? defaultAvi
                                    : avi
                            }
                            width={50}
                            height={50}
                            alt=""
                            className="w-full object-contain"
                        />
                    </div>
                </button>
            </div>
            <div className="flex flex-col flex-1 gap-1">
                <div className="flex flex-row justify-between items-center relative">
                    <div className="flex flex-row gap-2 items-center">
                        <button
                            onClick={handleProfileNav}
                            className="font-bold text-xl"
                        >
                            {display}
                        </button>
                        {verified && (
                            <span className="text-xs text-blue-600 flex items-center justify-center">
                                ✓
                            </span>
                        )}
                        <p className="opacity-50">@{user}</p>
                        <p className="opacity-50">·</p>
                        <p className="opacity-50">{formattedTime}</p>
                    </div>
                    {/* {currentUser && currentUser.username === user && (
                        <div onClick={() => handlePostOptions}>
                            <PostOptionsModal user={currentUser} post_id={id} />
                        </div>
                    )} */}
                </div>
                <p className="mb-2">{content}</p>
                <div className="flex justify-between">
                    {comment_count === -1 || likes === -1 ? (
                        <></>
                    ) : (
                        <>
                            <button
                                onClick={handleComment}
                                className="flex flex-row items-center gap-1"
                            >
                                <Image
                                    src={commentImg}
                                    width={16}
                                    height={16}
                                    alt=""
                                />
                                {comment_count}
                            </button>
                            <button
                                onClick={likePost}
                                className="flex flex-row items-center gap-1"
                            >
                                <Image
                                    src={didLike ? likeImgAlt : likeImg}
                                    width={16}
                                    height={16}
                                    alt=""
                                />
                                {currentLikes}
                            </button>
                            <button
                                onClick={sharePost}
                                className="flex flex-row items-center gap-1"
                            >
                                <Image
                                    src={shareImg}
                                    width={16}
                                    height={16}
                                    alt=""
                                />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
