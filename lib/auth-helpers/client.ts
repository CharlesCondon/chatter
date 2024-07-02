'use client';

import { createClient } from '@/lib/supabase/client';
import { type Provider } from '@supabase/supabase-js';
import { getURL } from '@/lib/helpers';
import { redirectToPath } from './server';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { v4 as uuidv4 } from 'uuid';

export async function handleRequest(
	e: React.FormEvent<HTMLFormElement>,
	requestFunc: (formData: FormData) => Promise<string>,
	router: AppRouterInstance | null = null
): Promise<boolean | void> {
	// Prevent default form submission refresh
	e.preventDefault();

	const formData = new FormData(e.currentTarget);
	const redirectUrl: string = await requestFunc(formData);

	if (router) {
		// If client-side router is provided, use it to redirect
		console.log('redirect via client')
		return router.push(redirectUrl);
	} else {
		// Otherwise, redirect server-side
		console.log('redirect via server')
		return await redirectToPath(redirectUrl);
	}
}
export async function handleRequestAlt(
	e: FormData,
	requestFunc: (formData: FormData) => Promise<string>,
	router: AppRouterInstance | null = null
): Promise<boolean | void> {
	// Prevent default form submission refresh
	
	const redirectUrl: string = await requestFunc(e);

	if (router) {
		// If client-side router is provided, use it to redirect
		console.log('redirect via client')
		return router.push(redirectUrl);
	} else {
		// Otherwise, redirect server-side
		console.log('redirect via server')
		return await redirectToPath(redirectUrl);
	}
}

export async function signInWithOAuth(e: React.FormEvent<HTMLFormElement>) {
	// Prevent default form submission refresh
	e.preventDefault();
	const formData = new FormData(e.currentTarget);
	const provider = String(formData.get('provider')).trim() as Provider;

	// Create client-side supabase client and call signInWithOAuth
	const supabase = createClient();
	const redirectURL = getURL('/auth/callback');
	await supabase.auth.signInWithOAuth({
		provider: provider,
		options: {
			redirectTo: redirectURL
		}
	});
}

export async function uploadAvatarClient(file: File, userId: string): Promise<string> {
	const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const { error } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
            cacheControl: "3600",
            upsert: true,
        });

    if (error) {
        console.error("Error uploading avatar:", error);
        return "";
    }

    const { data:publicURL} = supabase
        .storage
        .from("avatars")
        .getPublicUrl(filePath);

    if (!publicURL) {
        console.error("Error getting public URL for avatar");
        return "";
    }

    return publicURL.publicUrl;
}