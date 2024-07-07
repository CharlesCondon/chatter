// app/home/clientHome.tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Post from "@/components/ui/Post/Post";
import Image from "next/image";
import plusImg from "@/components/icons/plus.png";
import PullToRefresh from "react-simple-pull-to-refresh";
import {
    fetchHomePosts,
    fetchFollowingPosts,
    fetchNotifications,
} from "@/lib/auth-helpers/server";
import BackButton from "../BackButton/BackButton";
import defaultAvi from "@/components/icons/user.png";
import heartImg from "@/components/icons/heart.png";
import commentImg from "@/components/icons/chat.png";

interface Notif {
    id: string;
    created_at: string;
    user_id: string;
    type: string;
    read_status: string;
    creator_id: string;
    related_id: string;
    creator_profile: {
        id: string;
        username: string;
        full_name: string;
        avatar_url: string;
        verified?: boolean;
    };
}

export default function HomeClient({
    initialNotifs,
    currentUser,
}: {
    initialNotifs: Notif[];
    currentUser: string;
}) {
    const [notifs, setNotifs] = useState<Notif[]>(initialNotifs);

    const handleRefresh = async () => {
        try {
            let refreshedNotifs = await fetchNotifications();
            //@ts-ignore
            setNotifs(refreshedNotifs);
        } catch (error) {
            console.error("Error refreshing notifications:", error);
        }
    };

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

    function getNotif(notif: Notif) {
        let result = { text: "", img: {}, link: "" };
        if (notif.type === "likes") {
            result.link = `/posts/${currentUser}/${notif.related_id}`;
            result.img = heartImg;
            result.text = " liked your post ";
        } else if (notif.type === "comments") {
            result.link = `posts/${currentUser}/${notif.related_id}`;
            result.img = commentImg;
            result.text = " commented on your post ";
        } else {
            result.link = `/profile/${notif.creator_profile.username}`;
            result.img = defaultAvi;
            result.text = " followed you ";
        }
        return result;
    }

    return (
        <section className="relative min-h-full max-w-lg mx-auto">
            <nav className="flex flex-row items-center p-4 border-[var(--accent-light)] border-b">
                <BackButton />
                <h1 className="flex-1 text-center font-bold">Notifications</h1>
                <div className="basis-6"></div>
            </nav>
            <button
                onClick={handleRefresh}
                className="hidden md:block mt-2 border-b border-[var(--accent-light)] w-full pb-2"
            >
                Refresh
            </button>
            <PullToRefresh onRefresh={handleRefresh} className="text-center">
                <div className="h-full mb-32">
                    {notifs.map((notif, i) => {
                        return (
                            <div
                                key={i}
                                className="flex flex-row gap-2 px-4 py-2 border-b border-[var(--accent-light)] justify-between"
                            >
                                <div className="flex flex-row gap-2 ">
                                    <div className="min-w-12 h-12 flex items-center rounded-full overflow-hidden">
                                        <Image
                                            src={
                                                notif.creator_profile
                                                    .avatar_url ===
                                                "/images/default-avatar.png"
                                                    ? defaultAvi
                                                    : notif.creator_profile
                                                          .avatar_url
                                            }
                                            width={46}
                                            height={46}
                                            alt=""
                                            className="w-full object-contain"
                                        />
                                    </div>

                                    <div className="">
                                        <p className="text-left">
                                            <b>
                                                @
                                                {notif.creator_profile.username}
                                            </b>
                                            {getNotif(notif).text}
                                            <span className="opacity-65">
                                                {formatTime(notif.created_at)}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                <div className="min-w-11 flex items-center justify-center">
                                    <Link href={getNotif(notif).link}>
                                        <Image
                                            //@ts-ignore
                                            src={getNotif(notif).img}
                                            width={20}
                                            height={20}
                                            alt=""
                                        />
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </PullToRefresh>
        </section>
    );
}
