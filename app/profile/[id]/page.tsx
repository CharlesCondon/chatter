// app/posts/page.tsx
//import { supabase } from "../../lib/supabase";

export default async function PostsPage() {
    // const { data: posts, error } = await supabase.from("posts").select("*");

    // if (error) {
    //     console.error(error);
    //     return <p>Error loading posts</p>;
    // }

    let posts = [
        { id: "123", content: "hello world" },
        { id: "3", content: "world" },
        { id: "12", content: "hello" },
    ];

    return (
        <section>
            <h1>Profile Page</h1>
            {/* <ul>
                {posts.map((post) => (
                    <li key={post.id}>{post.content}</li>
                ))}
            </ul> */}
        </section>
    );
}
