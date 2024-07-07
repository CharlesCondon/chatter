// // app/posts/[id]/page.tsx

import DedicatedPost from "@/components/ui/DedicatedPost/DedicatedPost";
import Navbar from "@/components/ui/Navbar/Navbar";
import Post from "@/components/ui/Post/Post";
import { fetchDedicatedPost } from "@/lib/auth-helpers/server";

export default async function DedicatedPostPage({
    params,
}: {
    params: { username: string; id: string };
}) {
    const profileData = await fetchDedicatedPost(params.id);

    if (!profileData) {
        return <main>You must be signed in to view</main>;
    }
    //console.log(profileData);

    return (
        <main className="max-w-lg mx-auto flex flex-col gap-5 min-h-screen mb-12">
            <DedicatedPost
                //@ts-ignore
                display={profileData.creator_profile.full_name}
                //@ts-ignore
                user={profileData.creator_profile.username}
                //@ts-ignore
                user_id={profileData.creator_profile?.id}
                time={profileData.created_at}
                content={profileData.content}
                //@ts-ignore
                avi={profileData.creator_profile.avatar_url}
                id={profileData.id}
                comment_count={profileData.comment_count}
                likes={profileData.likes}
                //@ts-ignore
                verified={profileData.creator_profile.verified}
                haveLiked={profileData.haveLiked}
            />
            {profileData.comments ? (
                profileData.comments.map((post, i) => (
                    <Post
                        key={i}
                        //@ts-ignore
                        display={post.profile.full_name}
                        //@ts-ignore
                        user={post.profile.username}
                        //@ts-ignore
                        user_id={post.profile.id}
                        //@ts-ignore
                        time={post.created_at}
                        //@ts-ignore
                        content={post.content}
                        //@ts-ignore
                        avi={post.profile.avatar_url}
                        //@ts-ignore
                        id={post.id}
                        comment_count={-1}
                        likes={-1}
                        //@ts-ignore
                        verified={post.profile.verified}
                        haveLiked={false}
                    />
                ))
            ) : (
                <></>
            )}
            <Navbar activePage={""} />
        </main>
    );
}
