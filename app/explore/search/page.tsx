// app/explore/search/page.tsx
"use client";
import BackButton from "@/components/ui/BackButton/BackButton";
import Post from "@/components/ui/Post/Post";
import SearchBar from "@/components/ui/SearchBar/SearchBar";
import { fetchSearchResults } from "@/lib/auth-helpers/server";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import defaultAvi from "@/components/icons/user.png";

interface User {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string;
    verified?: boolean;
    bio?: string;
}

interface Post {
    id: string;
    content: string;
    user_id: string;
    created_at: string;
    likes: number;
    comment_count: number;
    profiles: {
        avatar_url: string;
        full_name: string;
        id: string;
        username: string;
        verified: boolean;
    };
}

interface SearchResult {
    users: User[];
    posts: Post[];
}

export default function Search() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const [results, setResults] = useState<SearchResult | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchResults = async () => {
            if (query.trim()) {
                const searchResults = await fetchSearchResults(query);
                // @ts-ignore
                setResults(searchResults);
                //console.log(searchResults);
            }
        };
        fetchResults();
    }, [query]);

    const handleProfileNav = (e: string) => {
        router.push(`/profile/${e}`);
    };

    return (
        <div className="mb-16 max-w-lg mx-auto">
            <div className="flex gap-4 p-4 border-b border-[var(--accent-light)] bg-[var(--background-alt)]">
                <BackButton />
                <SearchBar />
            </div>
            <section className="border-b border-[var(--accent-light)]">
                <h2 className="p-4 text-lg mb-2 font-bold ">People</h2>
                {results?.users.map((user) => (
                    <div
                        key={user.id}
                        className="mb-4 p-4 gap-4 flex flex-row "
                    >
                        <button onClick={() => handleProfileNav(user.username)}>
                            <div className="w-14 h-14 rounded-full overflow-hidden">
                                <Image
                                    src={
                                        user.avatar_url ===
                                        "/images/default-avatar.png"
                                            ? defaultAvi
                                            : user.avatar_url
                                    }
                                    width={50}
                                    height={50}
                                    alt=""
                                    className="w-full object-contain"
                                />
                            </div>
                        </button>
                        <button
                            onClick={() => handleProfileNav(user.username)}
                            className="text-left"
                        >
                            <p className="font-bold">{user.full_name}</p>
                            <p className="opacity-50 text-sm">
                                @{user.username}
                            </p>
                            <p className="">{user.bio}</p>
                        </button>
                    </div>
                ))}
            </section>
            <section>
                <h2 className="p-4 text-lg  font-bold border-b border-[var(--accent-light)]">
                    Posts
                </h2>
                <div className="bg-[var(--post-background)] py-2 flex flex-col gap-2">
                    {results?.posts.map((post, i) => (
                        <Post
                            key={i}
                            display={post.profiles.full_name}
                            user={post.profiles.username}
                            user_id={post.profiles.id}
                            time={post.created_at}
                            content={post.content}
                            avi={post.profiles.avatar_url}
                            id={post.id}
                            comment_count={post.comment_count}
                            likes={post.likes}
                            haveLiked={false}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}
