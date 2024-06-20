// app/posts/page.tsx
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import Post from "@/components/ui/Post";

export default async function PostsPage() {
    // const { data: posts, error } = await supabase.from("posts").select("*");

    // if (error) {
    //     console.error(error);
    //     return <p>Error loading posts</p>;
    // }

    let posts = [
        {
            display: "123",
            user: "hello world",
            time: "2h",
            content: "hello world",
            avi: "",
        },
        {
            display: "123",
            user: "hello world",
            time: "2h",
            content: "hello world",
            avi: "",
        },
        {
            display: "123",
            user: "hello world",
            time: "2h",
            content: "hello world",
            avi: "",
        },
        {
            display: "123",
            user: "hello world",
            time: "2h",
            content: "hello world",
            avi: "",
        },
        {
            display: "123",
            user: "hello world",
            time: "2h",
            content: "hello world",
            avi: "",
        },
        {
            display: "123",
            user: "hello world",
            time: "2h",
            content: "hello world",
            avi: "",
        },
        {
            display: "123",
            user: "hello world",
            time: "2h",
            content: "hello world",
            avi: "",
        },
    ];

    return (
        <section className="relative">
            <div className="flex flex-row border-b border-black pb-1">
                <div className="flex flex-1 text-center">
                    <Link href={"/home"} className="flex-1">
                        For You
                    </Link>
                </div>
                <div className="flex flex-1 text-center">
                    <Link href={"/home"} className="flex-1">
                        Following
                    </Link>
                </div>
            </div>
            <ul className="mb-40">
                {posts.map((post, i) => (
                    <Post
                        key={i}
                        display={post.display}
                        user={post.user}
                        time="2h"
                        content={post.content}
                        avi="/"
                        id="asdf"
                    />
                ))}
            </ul>
            <Link
                href="/posts/new"
                className="flex items-center justify-center border bg-white border-black fixed bottom-20 right-4 rounded-full h-16 w-16"
            >
                POST
            </Link>
        </section>
    );
}
