// app/home/clientHome.tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Post from "@/components/ui/Post/Post";
import Image from "next/image";
import plusImg from "@/components/icons/plus.png";
import PullToRefresh from "react-simple-pull-to-refresh";
import { fetchHomePosts, fetchFollowingPosts } from "@/lib/auth-helpers/server";

interface User {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string;
    verified?: boolean;
}

interface Post {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    likes: number;
    comment_count: number;
    haveLiked: boolean;
    user: User;
}

export default function HomeClient({ initialPosts }: { initialPosts: Post[] }) {
    const [posts, setPosts] = useState<Post[]>(initialPosts);
    const [viewFollowing, setViewFollowing] = useState(false);

    useEffect(() => {
        if (viewFollowing) {
            fetchFollowingPosts().then((data) => setPosts(data));
        } else {
            fetchHomePosts().then((data) => setPosts(data));
        }
    }, [viewFollowing]);

    const handleViewChange = (option: boolean) => {
        setViewFollowing(option);
    };

    const handleRefresh = async () => {
        try {
            let refreshedPosts;
            if (viewFollowing) {
                refreshedPosts = await fetchFollowingPosts();
            } else {
                refreshedPosts = await fetchHomePosts();
            }
            setPosts(refreshedPosts);
        } catch (error) {
            console.error("Error refreshing posts:", error);
        }
    };

    return (
        <section className="relative max-w-lg mx-auto">
            <div className="flex flex-row border-b border-[var(--accent-light)] pb-1 bg-[var(--background-alt)] pt-8">
                <button
                    onClick={() => handleViewChange(false)}
                    className={`flex-1 ${!viewFollowing ? "font-bold" : ""}`}
                >
                    For You
                </button>
                <button
                    onClick={() => handleViewChange(true)}
                    className={`flex-1 ${viewFollowing ? "font-bold" : ""}`}
                >
                    Following
                </button>
            </div>
            <button
                onClick={handleRefresh}
                className="hidden md:block mt-2 border-b border-[var(--accent-light)] w-full pb-2"
            >
                Refresh
            </button>
            <PullToRefresh onRefresh={handleRefresh} className="text-center">
                <div className=" bg-[var(--post-background)]">
                    <ul className="text-left flex flex-col gap-2 pt-2">
                        {posts.map((post, i) => (
                            <Post
                                key={i}
                                display={post.user.full_name}
                                user={post.user.username}
                                user_id={post.user.id}
                                time={post.created_at}
                                content={post.content}
                                avi={post.user.avatar_url}
                                id={post.id}
                                comment_count={post.comment_count}
                                likes={post.likes}
                                verified={post.user.verified}
                                haveLiked={post.haveLiked}
                            />
                        ))}
                    </ul>
                    <div className="flex items-center justify-center h-28 mb-14">
                        <h1>No more posts :{"("}</h1>
                    </div>
                </div>
            </PullToRefresh>
            <Link
                href="/posts/new"
                className="flex items-center justify-center border bg-[var(--background-alt)] border-[var(--accent-light)] fixed bottom-20 right-4 rounded-full h-16 w-16"
            >
                <Image src={plusImg} width={25} height={25} alt="" />
            </Link>
        </section>
    );
}
