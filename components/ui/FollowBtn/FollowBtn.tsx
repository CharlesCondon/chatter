// components/AltButton.tsx
"use client";

import { useState } from "react";
import { followUnfollow } from "@/lib/auth-helpers/server";

interface AltButtonProps {
    text: string;
    followTarget: string;
}

export default function FollowBtn({ text, followTarget }: AltButtonProps) {
    const [btnText, setBtnText] = useState(text);
    //console.log(followTarget);
    const handleBtn = async () => {
        if (btnText === "Follow") {
            //console.log("following");
            const result = await followUnfollow(btnText, followTarget);
            //console.log(result);
            setBtnText("Following");
        } else if (btnText === "Following") {
            //console.log("unfollowing");
            const result = await followUnfollow(btnText, followTarget);
            //console.log(result);
            setBtnText("Follow");
        }
    };

    return (
        <button
            onClick={() => handleBtn()}
            className={`border border-black py-1 px-2 rounded-lg ${
                btnText === "Follow"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-black"
            }`}
        >
            {btnText}
        </button>
    );
}
