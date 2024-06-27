// app/home/page.tsx

import { fetchHomePosts } from "@/lib/auth-helpers/server";
import dynamic from "next/dynamic";

const ClientHome = dynamic(
    () => import("@/components/ui/HomeClient/HomeClient"),
    { ssr: false }
);

export default async function Home() {
    const initialPosts = await fetchHomePosts();
    return <ClientHome initialPosts={initialPosts} />;
}
