"use client";

import Button from "@/components/ui/Button";
import React, { Suspense } from "react";
import Link from "next/link";
import { signUp } from "@/lib/auth-helpers/server";
import { handleRequest } from "@/lib/auth-helpers/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

// Define prop type with allowEmail boolean
interface SignUpProps {
    allowEmail: boolean;
    redirectMethod: string;
}

export default function SignUp({ allowEmail, redirectMethod }: SignUpProps) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = redirectMethod === "client" ? useRouter() : null;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const searchParams = useSearchParams();
    const errorMessage = searchParams.get("error_description");
    //console.log(errorMessage);

    const validateInputs = (
        displayName: string,
        username: string,
        password: string,
        password2: string
    ) => {
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
        if (password !== password2) {
            newErrors.password = "Passwords must be matching";
        }
        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true); // Disable the button while the request is being handled

        const formData = new FormData(e.currentTarget);
        const displayName = String(formData.get("displayName")).trim();
        const username = String(formData.get("username")).trim();
        const password = String(formData.get("password")).trim();
        const password2 = String(formData.get("password2")).trim();

        const validationErrors = validateInputs(
            displayName,
            username,
            password,
            password2
        );

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitting(false);
            return;
        }

        setErrors({});

        await handleRequest(e, signUp, router);
        setIsSubmitting(false);
    };

    return (
        <main className="p-10 flex flex-col gap-5 min-h-screen">
            <h1 className="text-5xl text-center">Sign Up</h1>
            <form
                className="flex flex-col gap-2 "
                onSubmit={(e) => handleSubmit(e)}
            >
                <input
                    required
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Email"
                    className="p-2 bg-[var(--alt-color)]"
                ></input>

                <input
                    required
                    id="displayName"
                    name="displayName"
                    type="text"
                    placeholder="Display Name"
                    className="p-2 bg-[var(--alt-color)]"
                ></input>
                {errors.displayName && (
                    <span className="text-red-500 text-sm">
                        {errors.displayName}
                    </span>
                )}
                <input
                    required
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Username"
                    className="p-2 bg-[var(--alt-color)]"
                ></input>
                {errors.username && (
                    <span className="text-red-500 text-sm">
                        {errors.username}
                    </span>
                )}
                <input
                    required
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    className="p-2 bg-[var(--alt-color)]"
                ></input>
                <input
                    required
                    id="password2"
                    name="password2"
                    type="password"
                    placeholder="Confirm Password"
                    className="p-2 bg-[var(--alt-color)]"
                ></input>
                {errors.password && (
                    <span className="text-red-500 text-sm">
                        {errors.password}
                    </span>
                )}
                {errorMessage && (
                    <span className="text-red-500 text-sm">{errorMessage}</span>
                )}
                <Button
                    variant="slim"
                    type="submit"
                    className="mt-1"
                    loading={isSubmitting}
                >
                    Submit
                </Button>
            </form>
            <p className="text-xs">
                By signing up, you agree to my{" "}
                <a
                    href={"/terms"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                >
                    Terms and Privacy Policy
                </a>
            </p>
            <Link href={"/signin"}>Log In</Link>
        </main>
    );
}
