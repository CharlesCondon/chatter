// app/posts/page.tsx
//import { supabase } from "../../lib/supabase";
import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import defaultAvi from "@/components/icons/user.png";
import Image from "next/image";
import BackButton from "@/components/ui/BackButton/BackButton";
import Post from "@/components/ui/Post/Post";
import UpdateProfile from "@/components/ui/AuthForms/UpdateProfile";

interface Profile {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string;
    bio: string;
}

const fetchProfile = async (): Promise<Profile | null> => {
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

    if (user === null) {
        return null;
    }

    //console.log(user.id);

    const { data, error } = await supabase
        .from("profiles")
        .select(
            `
            id, username, full_name, avatar_url, bio
            `
        )
        .eq("id", user.id)
        .single();

    if (error) {
        console.error("Error fetching profile:", error);
        return null;
    }

    if (!data) {
        console.log("Profile not found.");
        return null;
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
    };

    return profile;
};

export default async function EditProfilePage({
    params,
}: {
    params: { id: string };
}) {
    //console.log(params.id);
    const profile = await fetchProfile();
    //console.log(profile);

    if (!profile) {
        return (
            <section className="flex min-h-screen flex-col gap-3 ">
                <nav className="fixed z-10 w-full flex flex-row border-b border-black p-4 items-center">
                    <BackButton></BackButton>
                    <h1 className="flex-1 text-center font-bold">
                        Edit Profile
                    </h1>
                    <div className="basis-6"></div>
                </nav>
                <p>Profile not found</p>
            </section>
        );
    }

    // const testPostBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
    //     e.stopPropagation();
    //     e.preventDefault;
    //     alert("test btn");
    // };

    const handleProfileChange = async (e: React.FormEvent<HTMLFormElement>) => {
        console.log(e);
    };

    return (
        <section className="flex min-h-screen flex-col gap-3 ">
            <nav className="fixed z-10 w-full flex flex-row border-b border-black p-4 items-center">
                <BackButton></BackButton>
                <h1 className="flex-1 text-center font-bold">Edit Profile</h1>
                <div className="basis-6"></div>
            </nav>
            <div className="my-16 p-4">
                <UpdateProfile profile={profile} redirectMethod={"client"} />
            </div>
        </section>
    );
}
