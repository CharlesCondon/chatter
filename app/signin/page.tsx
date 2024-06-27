import { redirect } from "next/navigation";
import { getDefaultSignInView } from "@/lib/auth-helpers/settings";
import { cookies } from "next/headers";
import Card from "@/components/ui/Card";
import SignInPage from "@/components/ui/AuthForms/Signin";
import {
    getAuthTypes,
    getViewTypes,
    getRedirectMethod,
} from "@/lib/auth-helpers/settings";
import SignUp from "@/components/ui/AuthForms/Signin";

export default function SignIn() {
    const { allowOauth, allowEmail, allowPassword } = getAuthTypes();
    const redirectMethod = getRedirectMethod();
    // let viewProp: string;

    return (
        <SignInPage allowEmail={allowEmail} redirectMethod={redirectMethod} />
    );
}
