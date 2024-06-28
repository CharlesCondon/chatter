// app/home/page.tsx
import { fetchNotifications, fetchUser } from "@/lib/auth-helpers/server";
import dynamic from "next/dynamic";

const NotifClient = dynamic(
    () => import("@/components/ui/NotifClient/NotifClient"),
    { ssr: false }
);

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

export default async function Home() {
    //@ts-ignore
    const initialNotifs: Notif[] = (await fetchNotifications()) || [];
    if (!initialNotifs) {
        return <p>An error occured</p>;
    }
    const currentUser = await fetchUser();
    if (!currentUser) {
        return (
            <main className="relative min-h-full p-4">
                <h2 className="text-lg">Error: could not validate user</h2>
            </main>
        );
    }
    //console.log(initialNotifs);
    return (
        <NotifClient initialNotifs={initialNotifs} currentUser={currentUser} />
    );
}
