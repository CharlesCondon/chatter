// components/AltButton.tsx
"use client";

import { useState } from "react";
import { deletePost } from "@/lib/auth-helpers/server";
import { useRouter } from "next/navigation";
import dots from "@/components/icons/three-dots.png";
import Image from "next/image";

interface User {
    id: string;
    created_at: string;
    username: string;
    full_name: string;
    avatar_url: string;
    bio: string;
    verified: boolean;
    followers: number;
    following: number;
    liked_posts: string[];
}

interface settingsModalProps {
    user: User;
    post_id: string;
}

export default function PostOptionsModal({
    user,
    post_id,
}: settingsModalProps) {
    let [modalOpen, setModalOpen] = useState(false);
    const router = useRouter();

    const handleDeletePost = async () => {
        let result = await deletePost(user, post_id);
        if (result !== "") {
            alert(result);
        } else {
            router.push(`/home`);
        }
    };

    return (
        <div className="">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setModalOpen(!modalOpen);
                }}
                className="ml-4"
            >
                <Image src={dots} width={15} height={15} alt={"opions"} />
            </button>
            {modalOpen ? (
                <div>
                    <div
                        onClick={() => setModalOpen(false)}
                        className="flex items-center justify-center fixed top-0 left-0 bg-black opacity-50 w-full h-full z-40"
                    ></div>
                    <div className="fixed top-1/2 left-1/2 bg-white z-50 flex flex-col -translate-x-1/2 -translate-y-1/2 w-2/3 rounded">
                        <button
                            onClick={() => handleDeletePost()}
                            className="p-4 border-b border-black text-sm"
                        >
                            Delete
                        </button>
                        <button
                            onClick={() => setModalOpen(false)}
                            className="p-4 text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </div>
    );
}
