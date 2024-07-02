"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
    handleRequest,
    handleRequestAlt,
    uploadAvatarClient,
} from "@/lib/auth-helpers/client";
import { updateProfile, uploadAvatar } from "@/lib/auth-helpers/server";
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
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [avatar, setAvatar] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
        profile.avatar_url
    );
    const fileInputRef = useRef<HTMLInputElement | null>(null);

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
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const displayName = String(formData.get("displayName")).trim();
        const username = String(formData.get("username")).trim();
        const bio = String(formData.get("bio")).trim();

        const validationErrors = validateInputs(displayName, username);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitting(false);
            return;
        }

        setErrors({});

        // Upload avatar if a new one is selected
        let avatarUrl = profile.avatar_url;
        if (avatar) {
            avatarUrl = await uploadAvatarClient(avatar, profile.id);
            formData.set("avatar", avatarUrl);
            console.log(avatarUrl);
        }

        const updatedProfile = {
            id: profile.id,
            full_name: displayName,
            username: username,
            bio: bio,
            avatar_url: avatarUrl,
        };

        await handleRequestAlt(formData, updateProfile, router);

        setIsSubmitting(false);
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setAvatar(file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if (profile.avatar_url === "/images/default-avatar.png") {
            setAvatarPreview("");
        } else {
            setAvatarPreview(profile.avatar_url);
        }
    }, [profile.avatar_url]);

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <form className="flex flex-col gap-8" onSubmit={handleProfileChange}>
            <div className="flex flex-row items-center gap-4 w-full">
                <div className="w-20 h-20 rounded-full overflow-hidden">
                    <Image
                        src={avatarPreview || defaultAvi}
                        width={75}
                        height={75}
                        alt="User Avatar"
                        className="w-full object-cover m-auto"
                    />
                </div>

                <input
                    name="avatar"
                    type="file"
                    id="avatar"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    accept="image/png, image/jpeg"
                    className="hidden"
                />
                <button
                    type="button"
                    onClick={handleButtonClick}
                    className="mt-2 p-2 rounded bg-[var(--accent-color)] text-white"
                >
                    Change Avatar
                </button>
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
