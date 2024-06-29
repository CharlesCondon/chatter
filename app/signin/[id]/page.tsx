import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
    getAuthTypes,
    getViewTypes,
    getDefaultSignInView,
    getRedirectMethod,
} from "@/lib/auth-helpers/settings";
import Card from "@/components/ui/Card";
import PasswordSignIn from "@/components/ui/AuthForms/Signin";
import Separator from "@/components/ui/AuthForms/Separator";
//import OauthSignIn from '@/components/ui/AuthForms/OauthSignIn';
import ForgotPassword from "@/components/ui/AuthForms/ForgotPassword";
import UpdatePassword from "@/components/ui/AuthForms/UpdatePassword";
import SignUp from "@/components/ui/AuthForms/Signup";
import { Suspense } from "react";

export default async function SignIn({
    params,
    searchParams,
}: {
    params: { id: string };
    searchParams: { disable_button: boolean };
}) {
    const { allowOauth, allowEmail, allowPassword } = getAuthTypes();
    const viewTypes = getViewTypes();
    const redirectMethod = getRedirectMethod();

    // Declare 'viewProp' and initialize with the default value
    let viewProp: string;

    // Assign url id to 'viewProp' if it's a valid string and ViewTypes includes it
    if (typeof params.id === "string" && viewTypes.includes(params.id)) {
        viewProp = params.id;
    } else {
        const preferredSignInView =
            cookies().get("preferredSignInView")?.value || null;

        viewProp = getDefaultSignInView(preferredSignInView);
        console.log(viewProp);
        return redirect(`${viewProp}`);
    }

    // Check if the user is already logged in and redirect to the account page if so
    const supabase = createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (user && viewProp !== "update_password") {
        return redirect("/home");
    } else if (!user && viewProp === "update_password") {
        return redirect("/signin");
    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="flex justify-center height-screen-helper">
                <div className="flex flex-col justify-between max-w-lg p-3 m-auto w-80 ">
                    <div className="flex justify-center pb-12 "></div>

                    {/* {viewProp === "" && (
                        <PasswordSignIn
                            allowEmail={allowEmail}
                            redirectMethod={redirectMethod}
                        />
                    )} */}
                    {viewProp === "forgot_password" && (
                        <ForgotPassword
                            allowEmail={allowEmail}
                            redirectMethod={redirectMethod}
                            disableButton={searchParams.disable_button}
                        />
                    )}
                    {viewProp === "update_password" && (
                        <UpdatePassword redirectMethod={redirectMethod} />
                    )}
                    {viewProp === "signup" && (
                        <SignUp
                            allowEmail={allowEmail}
                            redirectMethod={redirectMethod}
                        />
                    )}

                    {/* {viewProp !== "update_password" &&
                        viewProp !== "signup" &&
                        allowOauth && (
                            <>
                                <Separator text="Third-party sign-in" />
                                <OauthSignIn />
                            </>
                        )} */}
                </div>
            </div>
        </Suspense>
    );
}
