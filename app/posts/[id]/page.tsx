// // app/posts/[id]/page.tsx
// import { fetchPost } from "../../lib/fetchPost";

export default async function PostPage({ params }: { params: { id: string } }) {
    //const post = await fetchPost(params.id);

    return (
        <article>
            <h1>Singlular Post</h1>
            {/* <h1>{post.title}</h1>
            <p>{post.content}</p> */}
        </article>
    );
}

// // lib/fetchPost.ts
// export async function fetchPost(id: string) {
//     const response = await fetch(`https://api.example.com/posts/${id}`);
//     return response.json();
// }
