// app/posts/page.tsx
//import { supabase } from "../../lib/supabase";
import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import defaultAvi from "@/components/icons/user.png";
import Image from "next/image";
import BackButton from "@/components/ui/BackButton/BackButton";
import Post from "@/components/ui/Post/Post";
import Link from "next/link";
import FollowBtn from "@/components/ui/FollowBtn/FollowBtn";
import shareImg from "@/components/icons/share.png";
import SettingsModal from "@/components/ui/SettingsModal/SettingsModal";

interface Post {
    id: string;
    created_at: string;
    content: string;
    user_id: string;
    likes: number;
    comment_count: number;
    isLiked: boolean;
}

interface Profile {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string;
    bio: string;
    followers: number;
    following: number;
    verified: boolean;
}

interface ProfileWithPosts {
    profile: Profile;
    posts: Post[];
    isUser: boolean;
    isFollowing: boolean;
}

const fetchProfile = async (
    username: string
): Promise<ProfileWithPosts | null> => {
    const supabase = createClient();
    //console.log("username: " + username);

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
        console.error("Error fetching current user:", userError);
        //return null;
    }

    //console.log(user);

    const { data, error } = await supabase
        .from("profiles")
        .select(
            `
            id, username, full_name, avatar_url, bio, followers, following, verified,
            posts (id, created_at, user_id, content, likes, comment_count)
            `
        )
        .eq("username", username)
        .single();

    if (error) {
        console.error("Error fetching profile:", error);
        return null;
    }

    if (!data) {
        console.log("Profile not found.");
        return null;
    }

    let likedPosts: Set<string>;
    if (user) {
        const { data: likes, error: likesError } = await supabase
            .from("likes")
            .select("post_id")
            .eq("user_id", user.id);

        if (likesError) {
            console.error("Error fetching likes:", likesError);
        }

        likedPosts = new Set(likes?.map((like) => like.post_id));
    }

    const profile: Profile = {
        //@ts-ignore
        id: data.id,
        //@ts-ignore
        username: data.username,
        //@ts-ignore
        full_name: data.full_name || "Anonymous User",
        //@ts-ignore
        avatar_url: data.avatar_url || defaultAvi.src,
        //@ts-ignore
        bio: data.bio || "",
        //@ts-ignore
        followers: data.followers || 0,
        //@ts-ignore
        following: data.following || 0,
        //@ts-ignore
        verified: data.verified || false,
    };

    const posts: Post[] =
        //@ts-ignore
        data.posts.map((post) => ({
            ...post,
            isLiked: likedPosts.has(post.id),
        })) || [];

    posts.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA;
    });

    const isUser = user ? user.id === profile.id : false;
    let isFollowing = false;

    if (!isUser && user) {
        const { data, error } = await supabase
            .from("followers")
            .select(
                `
                id, user_id, follower_id
                `
            )
            .eq("follower_id", user.id)
            .eq("user_id", profile.id);

        if (error) {
            console.error("Error fetching profile:", error);
            return null;
        }

        if (data.length === 0) {
            //console.log("Not following this user.");
            isFollowing = false;
        } else {
            //console.log("Following user.");
            isFollowing = true;
        }
    }

    // let checkedPosts: Post[] = data.posts.map((post) => ({
    //     ...post,
    //     isLiked: likedPosts.has(post.id),
    // }));

    // console.log(checkedPosts);
    // console.log("");
    // console.log("");
    // console.log("");
    //console.log(posts);

    return {
        profile,
        posts,
        isUser,
        isFollowing,
    };
};

export default async function ProfilePage({
    params,
}: {
    params: { id: string };
}) {
    //console.log(params.id);
    const profile = await fetchProfile(params.id);
    //console.log(profile);

    if (!profile) {
        return (
            <section className="flex min-h-screen flex-col gap-3 ">
                <p>Profile not found</p>
            </section>
        );
    }

    // const testPostBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
    //     e.stopPropagation();
    //     e.preventDefault;
    //     alert("test btn");
    // };

    return (
        <section className="flex min-h-screen flex-col gap-3 ">
            <nav className="fixed z-10 w-full flex flex-row border-b border-[var(--accent-light)] p-4 items-center">
                <BackButton></BackButton>
                <h1 className="flex-1 text-center font-bold">
                    {profile.profile.username}
                </h1>
                <div className="basis-6"></div>
            </nav>
            <div className="flex flex-row gap-4 p-4 mt-16 ">
                <div className="w-20 h-20 rounded-full overflow-hidden">
                    <Image
                        src={
                            profile.profile.avatar_url ===
                            "/images/default-avatar.png"
                                ? defaultAvi
                                : profile.profile.avatar_url
                        }
                        width={100}
                        height={100}
                        alt=""
                        style={{ objectFit: "contain" }}
                    />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                    <div className="flex flex-row gap-2 flex-wrap">
                        <h1 className="text-2xl text-ellipsis ">
                            {profile.profile.username}
                        </h1>
                        {profile.profile.verified && (
                            <span className="text-2xl text-blue-600 flex items-center justify-center">
                                ✓
                            </span>
                        )}
                        {profile.isUser && (
                            <SettingsModal user={profile.profile.username} />
                        )}
                    </div>
                    {!profile.isUser ? (
                        <div className="flex flex-row gap-2">
                            {!profile.isFollowing ? (
                                <FollowBtn
                                    text="Follow"
                                    followTarget={profile.profile.id}
                                />
                            ) : (
                                <FollowBtn
                                    text="Following"
                                    followTarget={profile.profile.id}
                                />
                            )}

                            {/* <button className="border border-black py-1 px-2 rounded-lg">
                                Message
                            </button>
                            <button className="border border-black py-1 px-2 rounded-lg">
                                <Image
                                    src={shareImg}
                                    width={17}
                                    height={17}
                                    alt="share"
                                />
                            </button> */}
                        </div>
                    ) : (
                        <div className="flex flex-row gap-2">
                            <Link
                                href={"/profile/edit"}
                                className="border border-black py-1 px-2 rounded-lg"
                            >
                                Edit profile
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            <div className="px-4">
                <h2 className="font-bold text-md">
                    {profile.profile.full_name}
                </h2>
                <p className="text-sm opacity-50">
                    @{profile.profile.username}
                </p>
                <p>{profile.profile.bio}</p>
            </div>
            <div>
                <div className="flex flex-row justify-around border-y border-[var(--accent-light)] py-2">
                    <div className="flex-1 flex flex-col items-center">
                        <p className="font-bold">{profile.posts.length}</p>
                        <p className="text-sm opacity-50">posts</p>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                        <p className="font-bold">{profile.profile.followers}</p>
                        <p className="text-sm opacity-50">followers</p>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                        <p className="font-bold">{profile.profile.following}</p>
                        <p className="text-sm opacity-50">following</p>
                    </div>
                </div>
                <div className="bg-[#DDECF1] py-2 flex flex-col gap-2">
                    {profile.posts.map((post, i) => {
                        return (
                            <Post
                                key={i}
                                display={profile.profile.full_name}
                                user={profile.profile.username}
                                user_id={profile.profile.id}
                                time={post.created_at}
                                content={post.content}
                                avi={profile.profile.avatar_url}
                                id={post.id}
                                comment_count={post.comment_count}
                                likes={post.likes}
                                verified={profile.profile.verified}
                                haveLiked={post.isLiked}
                            />
                        );
                    })}
                    <div className="flex items-center justify-center h-28 mb-14">
                        <h1>No more posts :{"("}</h1>
                    </div>
                </div>
            </div>
        </section>
    );
}
