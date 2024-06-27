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
import BackButton from "../BackButton/BackButton";
import PostOptionsModal from "../PostOptionsModal/PostOptionsModal";
import { useUser } from "@/components/UserContext";

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
    verified: boolean;
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
    const router = useRouter();
    const currentUser = useUser().profile;

    useEffect(() => {
        const formatTime = (timestamp: string): string => {
            // Create a Date object from the timestamp
            const postDate = new Date(timestamp);

            // Format the time part
            const timeFormatter = new Intl.DateTimeFormat("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
            });
            const formattedTime = timeFormatter.format(postDate);

            // Format the date part
            const dateFormatter = new Intl.DateTimeFormat("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            });
            const formattedDate = dateFormatter.format(postDate);

            // Combine time and date with separator
            return `${formattedTime} · ${formattedDate}`;
        };

        setFormattedTime(formatTime(time));
    }, [time]);

    // const navigateToPost = () => {
    //     router.push(`/posts/${user}/${id}`);
    // };

    const testPostBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        e.preventDefault;
        alert("test btn");
    };

    const handleComment = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        e.preventDefault;
        router.push(`/comment/${user}/${id}`);
        //alert("test btn");
    };

    const likePost = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        e.preventDefault;

        if (!didLike) {
            setCurrentLikes(currentLikes + 1);
            const result = await likeUnlike(id, "like", user);
            if (result !== "success") {
                setCurrentLikes(currentLikes - 1);
            }
            setDidLike(!didLike);
        } else {
            setCurrentLikes(currentLikes - 1);
            const result = await likeUnlike(id, "unlike", user);
            if (result !== "success") {
                setCurrentLikes(currentLikes + 1);
            }
            setDidLike(!didLike);
        }
    };

    const sharePost = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        e.preventDefault;

        alert("Feature coming soon!");
    };

    const handleProfileNav = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        e.preventDefault;
        router.push(`/profile/${user}`);
    };

    return (
        <div>
            <div className="ml-4 mt-4">
                <BackButton />
            </div>

            <div className="flex flex-row pt-2 pr-4 pl-4 pb-2 border-b border-black gap-2 ">
                <div className="flex flex-col flex-1 gap-1">
                    <div className="flex flex-row gap-2 justify-between items-center">
                        <button onClick={handleProfileNav}>
                            <Image
                                src={
                                    avi === "/images/default-avatar.png"
                                        ? defaultAvi
                                        : avi
                                }
                                width={50}
                                height={50}
                                alt=""
                            />
                        </button>
                        <div className="flex flex-col w-full">
                            <div className="flex flex-row justify-between">
                                <div className="flex flex-row gap-2">
                                    <button
                                        onClick={handleProfileNav}
                                        className="font-bold text-xl"
                                    >
                                        {display}
                                    </button>
                                    {verified && (
                                        <span className="text-sm text-blue-600 flex items-center justify-center">
                                            ✓
                                        </span>
                                    )}
                                </div>
                                {currentUser &&
                                    currentUser.username === user && (
                                        <PostOptionsModal
                                            user={currentUser}
                                            post_id={id}
                                        />
                                    )}
                            </div>

                            <p className="opacity-50">@{user}</p>
                        </div>
                    </div>
                    <p className="my-4">{content}</p>
                    <time dateTime={time} className="opacity-50 text-sm ">
                        {formattedTime}
                    </time>
                </div>
            </div>
            <div className="flex justify-between border-b border-black pt-2 pr-4 pl-4 pb-2">
                <button
                    onClick={handleComment}
                    className="flex flex-row items-center gap-1"
                >
                    <Image src={commentImg} width={16} height={16} alt="" />
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
                    <Image src={shareImg} width={16} height={16} alt="" />
                </button>
            </div>
        </div>
    );
}
