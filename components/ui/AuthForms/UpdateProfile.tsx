"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { handleRequest } from "@/lib/auth-helpers/client";
import { updateProfile } from "@/lib/auth-helpers/server";
import { signUp } from "@/lib/auth-helpers/server";
import Button from "../Button";
import Image from "next/image";
import defaultAvi from "@/components/icons/user.png";

interface Profile {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string;
    bio: string;
}

interface SignUpProps {
    profile: Profile;
    redirectMethod: string;
}

export default function UpdateProfile({
    profile,
    redirectMethod,
}: SignUpProps) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = redirectMethod === "client" ? useRouter() : null;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateInputs = (displayName: string, username: string) => {
        const newErrors: { [key: string]: string } = {};
        if (displayName.length <= 3) {
            newErrors.displayName =
                "Display Name must be longer than 3 characters.";
        }
        if (username.length <= 3) {
            newErrors.username = "Username must be longer than 3 characters.";
        }
        const usernameRegex = /^[a-zA-Z0-9-_]+$/;
        if (!usernameRegex.test(username)) {
            newErrors.username =
                "Username can only contain letters, numbers, -, or _";
        }
        return newErrors;
    };

    const handleProfileChange = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true); // Disable the button while the request is being handled

        const formData = new FormData(e.currentTarget);
        const displayName = String(formData.get("displayName")).trim();
        const username = String(formData.get("username")).trim();
        const bio = String(formData.get("bio")).trim();

        const validationErrors = validateInputs(displayName, username);

        if (
            displayName === profile.full_name &&
            username === profile.username &&
            bio === profile.bio
        ) {
            setIsSubmitting(false);
            return;
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitting(false);
            return;
        }

        setErrors({});

        await handleRequest(e, updateProfile, router);
        setIsSubmitting(false);
    };

    return (
        <form
            className="flex flex-col gap-8"
            onSubmit={(e) => handleProfileChange(e)}
        >
            <div>
                <Image
                    src={
                        profile.avatar_url === "/images/default-avatar.png"
                            ? defaultAvi
                            : profile.avatar_url
                    }
                    width={75}
                    height={75}
                    alt=""
                />
            </div>
            <div className="flex flex-col">
                <label className="font-bold pb-2">Display Name</label>
                <input
                    name="displayName"
                    className={`p-2 rounded ${
                        errors.displayName ? "border-red-500 border" : ""
                    }`}
                    type="text"
                    defaultValue={profile.full_name}
                />
                {errors.displayName && (
                    <span className="text-red-500 text-sm">
                        {errors.displayName}
                    </span>
                )}
            </div>
            <div className="flex flex-col">
                <label className="font-bold pb-2">Username</label>
                <input
                    name="username"
                    className={`p-2 rounded ${
                        errors.username ? "border-red-500 border" : ""
                    }`}
                    type="text"
                    defaultValue={profile.username}
                />
                {errors.username && (
                    <span className="text-red-500 text-sm">
                        {errors.username}
                    </span>
                )}
            </div>
            <div className="flex flex-col">
                <label className="font-bold pb-2">Bio</label>
                <textarea
                    name="bio"
                    className="p-2 rounded"
                    defaultValue={profile.bio}
                />
            </div>
            <Button
                variant="slim"
                type="submit"
                className="mt-1"
                loading={isSubmitting}
            >
                Submit
            </Button>
        </form>
    );
}
