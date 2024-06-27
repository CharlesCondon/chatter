"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { handleRequest } from "@/lib/auth-helpers/client";
import { signInWithPassword } from "@/lib/auth-helpers/server";
import { signUp } from "@/lib/auth-helpers/server";
import Button from "../Button";

interface SignUpProps {
    allowEmail: boolean;
    redirectMethod: string;
}

export default function SignUp({ allowEmail, redirectMethod }: SignUpProps) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = redirectMethod === "client" ? useRouter() : null;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setIsSubmitting(true); // Disable the button while the request is being handled
        await handleRequest(e, signInWithPassword, router);
        setIsSubmitting(false);
    };

    return (
        <main className="p-10 flex flex-col gap-5 min-h-screen">
            <h1 className="text-5xl text-center">Sign In</h1>
            <form
                noValidate={true}
                className="mb-4"
                onSubmit={(e) => handleSubmit(e)}
            >
                <div className="grid gap-2">
                    <div className="grid gap-1">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            placeholder="name@example.com"
                            type="email"
                            name="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            className="w-full p-3 rounded-md bg-zinc-800"
                        />
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            placeholder="Password"
                            type="password"
                            name="password"
                            autoComplete="current-password"
                            className="w-full p-3 rounded-md bg-zinc-800"
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
                </div>
            </form>
            <Link href={"signin/signup"}>Sign Up</Link>
            {/* <Link href="/signin/forgot_password" className="">
                Forgot your password?
            </Link> */}
        </main>
    );
}
