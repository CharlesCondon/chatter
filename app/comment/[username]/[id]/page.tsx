// // app/posts/[id]/page.tsx

import BackButton from "@/components/ui/BackButton/BackButton";
import CommentForm from "@/components/ui/CommentForm/CommentForm";
import DedicatedPost from "@/components/ui/DedicatedPost/DedicatedPost";
import Navbar from "@/components/ui/Navbar/Navbar";
import { fetchComment } from "@/lib/auth-helpers/server";
import { Suspense } from "react";

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

export default async function DedicatedPostPage({
    params,
}: {
    params: { username: string; id: string };
}) {
    const profileData = await fetchComment(params.id);
    //console.log(profileData);
    if (!profileData) {
        return <main>You must be signed in to view</main>;
    }
    const post: Post = {
        //@ts-ignore
        id: profileData.id,
        //@ts-ignore
        content: profileData.content,
        //@ts-ignore
        created_at: profileData.created_at,
    };

    //@ts-ignore
    const profile: User = profileData.profile;

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <main className=" flex flex-col gap-5 min-h-screen">
                <div className="pl-4 py-4 bg-[var(--background-alt)] border-[var(--accent-light)] border-b">
                    <BackButton />
                </div>
                <CommentForm
                    //@ts-ignore
                    user={profile}
                    post={post}
                />
                <Navbar activePage={""} />
            </main>
        </Suspense>
    );
}
