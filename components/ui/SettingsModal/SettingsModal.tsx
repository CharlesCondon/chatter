// components/AltButton.tsx
"use client";

import { useState } from "react";
import { SignOut } from "@/lib/auth-helpers/server";
import { useRouter } from "next/navigation";

interface settingsModalProps {
    user: string;
}

export default function SettingsModal({ user }: settingsModalProps) {
    let [modalOpen, setModalOpen] = useState(false);
    const router = useRouter();

    const handleSignOut = async () => {
        await SignOut(`/profile/${user}`);
        router.push("/");
    };

    return (
        <div className="">
            <button
                onClick={() => setModalOpen(!modalOpen)}
                className="ml-4 pb-2"
            >
                ...
            </button>
            {modalOpen ? (
                <div>
                    <div
                        onClick={() => setModalOpen(false)}
                        className="flex items-center justify-center fixed top-0 left-0 bg-black opacity-50 w-full h-full z-40"
                    ></div>
                    <div className="fixed top-1/2 left-1/2 bg-white z-50 flex flex-col -translate-x-1/2 -translate-y-1/2 w-2/3 rounded">
                        <button
                            onClick={() => handleSignOut()}
                            className="p-4 border-b border-black text-sm"
                        >
                            Log Out
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
