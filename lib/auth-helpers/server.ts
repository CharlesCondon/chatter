'use server';

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getURL, getErrorRedirect, getStatusRedirect } from '../helpers';
import { getAuthTypes } from '../auth-helpers/settings';
import { v4 as uuidv4 } from "uuid";

function isValidEmail(email: string) {
	var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
	return regex.test(email);
}

export async function redirectToPath(path: string) {
  	return redirect(path);
}

export async function SignOut(path: string) {
	const pathName = path;

	const supabase = createClient();
	
	const { error } = await supabase.auth.signOut();

	if (error) {

		return getErrorRedirect(
		pathName,
		'Hmm... Something went wrong.',
		'You could not be signed out.'
		);
	}

	return '/home';
}

export async function followUnfollow(text: string, followTarget: string) {
	const supabase = createClient()
	//console.log(followTarget)
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return 'User not signed in'
	}

	if (text === 'Follow') {
		//@ts-ignore
		const { data, error } = await supabase.rpc('follow_user', {
			follow_target: followTarget,
			user_target: user.id
		});

		if (error) {
			console.log(error);
			return 'an error occured when trying to follow'
		} else {
			console.log('followed user')
		}

		const { error:notifError } = await supabase.from('notifications').insert(
			{
				user_id: followTarget,
				created_at: new Date().toISOString(),
				type: 'followers',
				related_id: user.id,
				creator_id: user.id
			},
		);

		if (notifError) {
			console.log(notifError);
			return 'an error occured when trying to create notification'
		}
			
	} else if (text === 'Following') {
		//@ts-ignore
		const { data, error } = await supabase.rpc('unfollow_user', {
			follow_target: followTarget,
			user_target: user.id
		});

		if (error) {
			console.log(error);
			return 'an error occured when trying to unfollow'
		} else {
			console.log('unfollowed user')
		}
		
	}

	return
}

export async function fetchComment(post_id: string) {
	const supabase = createClient()

	const { data:postData, error:postError } = await supabase
        .from("posts")
        .select(
            "id, content, created_at, user_id, likes, comment_count, profile:profiles(id, username, full_name, avatar_url, verified)"
        )
		.eq("id", post_id)
		.single();

	if (postError) {
		console.error("Error fetching profile:", postError);
		return null;
	}

	if (!postData) {
		console.log("Profile not found.");
		return null;
	}

	return postData;
}

export async function fetchNotifications() {
	const supabase = createClient()

	const {
		data: { user },
	} = await supabase.auth.getUser();
	//console.log("user: " + user)

	if (!user) {
		console.log('user not recognized when getting notifications');
		return
	}

    // Fetch notifications with the creator's profile attached
    const { data: notifs, error: notifError } = await supabase
        .from('notifications')
        .select(`
            id,
            created_at,
            user_id,
            type,
            read_status,
            creator_id,
			related_id,
            creator_profile:profiles!notifications_creator_id_fkey (
                id,
                username,
                full_name,
                avatar_url,
                verified
            )
        `)
        .eq('user_id', user.id)
        .limit(50)
        .order('created_at', { ascending: false });

    if (notifError) {
        console.log('Error fetching notifications:', notifError);
        return;
    }

	if (notifs.length === 0) {
		return [];
	}

    return notifs;
}

interface CommentPost{
	username: string,
	post_id: string,
	target_user: string
}
export async function postComment(formData: FormData, post:CommentPost) {
	const supabase = createClient()
	const content = String(formData.get("content")).trim();
	let redirectPath: string;

	if (!content || content.trim().length === 0) {
		return getStatusRedirect(
			`/comment/${post.username}/${post.post_id}`,
			'Error!',
			'Content cannot be empty.'
		);
	}

	const {
		data: { user },
	} = await supabase.auth.getUser();
	//console.log("user: " + user)

	if (!user) {
		return getStatusRedirect(
			'/signin',
			'Error!',
			'You need to sign in to create a post.'
		);
	}

	

	if (content.length > 240) {
		return getStatusRedirect(
			`/comment/${post.username}/${post.post_id}`,
			'Error!',
			'Content must be shorter than 240 characters'
		);
	}

	const user_id = user.id;
	const post_id = post.post_id
	//@ts-ignore
	const { data, error } = await supabase.rpc('add_comment_and_update_count', {
        user_id,
        post_id,
        content,
    });

	if (error) {
		console.log(error)
		return getStatusRedirect(
			`/comment/${post.username}/${post.post_id}`,
			'Error!',
			'Failed to publish post.',
			true
		);
	}

	const { error:notifError } = await supabase.from('notifications').insert(
		{
			user_id: post.target_user,
			created_at: new Date().toISOString(),
			type: 'comments',
			related_id: post_id,
			creator_id: user_id
		},
	);

	if (notifError) {
		console.log('Error creating comment notification')
		console.log(notifError)
		return getStatusRedirect(
			`/comment/${post.username}/${post.post_id}`,
			'Error!',
			'Failed to publish post.',
			true
		);
	}

	return 'Success'
}

export async function fetchHomePosts() {
	const supabase = createClient();
    const { data, error } = await supabase
        .from("posts")
        .select(
            "id, content, created_at, user_id, likes, comment_count, profiles:profiles(id, username, full_name, avatar_url, verified)"
        )
		.limit(50)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching posts:", error);
        return [];
    }

    if (!data) {
        console.log("No data was returned :(");
        return [];
    }

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
        console.error("Error fetching current user:", userError);
    }

    let likedPosts: Set<string>;
    if (user) {
        const { data: likes, error: likesError } = await supabase
            .from("likes")
            .select("post_id")
            .eq("user_id", user.id);

        if (likesError) {
            console.error("Error fetching likes:", likesError);
            return [];
        }

        likedPosts = new Set(likes.map((like) => like.post_id));
    }

    //console.log(data);
    //@ts-ignore
    return data.map((post) => ({
        //@ts-ignore
        id: post.id,
        //@ts-ignore
        content: post.content,
        //@ts-ignore
        created_at: post.created_at,
        //@ts-ignore
        user_id: post.user_id,
        //@ts-ignore
        likes: post.likes,
        //@ts-ignore
        comment_count: post.comment_count,
        //@ts-ignore
        haveLiked: likedPosts.has(post.id),
        //@ts-ignore
        user: post.profiles
            ? {
                  //@ts-ignore
                  id: post.profiles.id,
                  //@ts-ignore
                  username: post.profiles.username || "Anonymous",
                  //@ts-ignore
                  full_name: post.profiles.full_name || "Anonymous User",
                  //@ts-ignore
                  avatar_url: post.profiles.avatar_url || defaultAvi.src,
                  //@ts-ignore
                  verified: post.profiles.verified,
                  // @ts-ignore: End of ignore directive
              }
            : {
                  id: "",
                  username: "Anonymous",
                  full_name: "Anonymous User",
                  avatar_url: "/images/default-avatar.png",
              },
    }));
}

export async function fetchFollowingPosts() {
    const supabase = createClient();

    const { data: {user}, error: userError } = await supabase.auth.getUser();

    if (userError) {
        console.error("Error fetching current user:", userError);
        return [];
    }

    if (!user) {
        console.error("No current user");
        return [];
    }

    const { data: following, error: followingError } = await supabase
        .from("followers")
        .select("user_id")
        .eq("follower_id", user.id);

    if (followingError) {
        console.error("Error fetching following:", followingError);
        return [];
    }

    const followingIds = following.map((follow) => follow.user_id);

    const { data, error } = await supabase
        .from("posts")
        .select(`
            id, 
            content, 
            created_at, 
            user_id, 
            likes, 
            comment_count, 
            profiles:profiles(id, username, full_name, avatar_url, verified)
        `)
        .in("user_id", followingIds)
        .limit(50)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching posts:", error);
        return [];
    }

    let likedPosts = new Set<string>();
    if (user) {
        const { data: likes, error: likesError } = await supabase
            .from("likes")
            .select("post_id")
            .eq("user_id", user.id);

        if (likesError) {
            console.error("Error fetching likes:", likesError);
            return [];
        }

        likedPosts = new Set(likes.map((like) => like.post_id));
    }

    return data.map((post) => ({
		//@ts-ignore
        id: post.id,
		//@ts-ignore
        content: post.content,
		//@ts-ignore
        created_at: post.created_at,
		//@ts-ignore
        user_id: post.user_id,
		//@ts-ignore
        likes: post.likes,
		//@ts-ignore
        comment_count: post.comment_count,
		//@ts-ignore
        haveLiked: likedPosts.has(post.id),
		//@ts-ignore
        user: post.profiles
            ? {
				//@ts-ignore
                  id: post.profiles.id,
				  //@ts-ignore
                  username: post.profiles.username || "Anonymous",
				  //@ts-ignore
                  full_name: post.profiles.full_name || "Anonymous User",
				  //@ts-ignore
                  avatar_url: post.profiles.avatar_url || defaultAvi.src,
				  //@ts-ignore
                  verified: post.profiles.verified,
              }
            : {
                  id: "",
                  username: "Anonymous",
                  full_name: "Anonymous User",
                  avatar_url: "/images/default-avatar.png",
              },
    }));
}

export async function fetchDedicatedPost(post_id: string) {
	const supabase = createClient()
	const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
        console.error("Error fetching current user:", userError);
        return null;
    }

	const { data, error } = await supabase
        .from("posts")
        .select(
            "id, content, created_at, user_id, likes, comment_count, profile:profiles(id, username, full_name, avatar_url, verified)"
        )
		.eq("id", post_id)
		.single();

	if (error) {
		console.log(error)
		console.error("Error fetching profile:", error);
		return null;
	}

	if (!data) {
		console.log("Profile not found.");
		return null;
	}

	const { data:commentList, error:commentError } = await supabase
        .from("comments")
        .select(
        `
        id,
        content,
        created_at,
        user_id,
        likes,
        post_id,
        profile:profiles (
            id,
            username,
            full_name,
            avatar_url,
			verified
        )
        `
    )
		.eq("post_id", post_id)
		.order("created_at", { ascending: false });

	if (commentError) {
		console.error("Error fetching comments and profiles:", error);
	}
	//@ts-ignore
	const targetUser: string  = data.profile.id;
	//@ts-ignore
	const isUser: boolean = user ? user.id === targetUser : false;

	let isFollowing = false;

    if (!isUser && user) {
        const { data, error } = await supabase
            .from("followers")
            .select(
                `
                id, user_id, follower_id
                `
            )
            .eq("follower_id", user.id)
            .eq("user_id", targetUser);

        if (error) {
            console.error("Error fetching profile:", error);
            return null;
        }

        if (data.length === 0) {
            //console.log("Not following this user.");
            isFollowing = false;
        } else {
            //console.log("Following user.");
            isFollowing = true;
        }
    }

	let haveLiked: boolean = false;	
    if (user) {
        const { data: likes, error: likesError } = await supabase
            .from("likes")
            .select("post_id")
            .eq("user_id", user.id)
			.eq("post_id", post_id)
			.single();

        if (likesError) {
            console.error("Error fetching likes:", likesError);
        }
        haveLiked = likes ? likes.post_id === post_id : false
    }
	
	const dedicatedPostData = {
		//@ts-ignore
		id: data.id,
		//@ts-ignore
		content: data.content,
		//@ts-ignore
		created_at: data.created_at,
		//@ts-ignore
		creator: data.user_id,
		//@ts-ignore
		likes: data.likes,
		//@ts-ignore
		comment_count: data.comment_count,
		isUser: isUser,
		isFollowing: isFollowing,
		haveLiked: haveLiked,
		//@ts-ignore
		creator_profile: data.profile,
		//@ts-ignore
		comments: commentList,
	}
	return dedicatedPostData;
}

export async function likeUnlike(post_id: string, option: string, target_user: string) {
	const supabase = createClient()
	
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return 'failed'
	}
	const currentUser = user;

	if (option === 'like') {
		
		//console.log('post: ' + post_id)
		//console.log('user: ' + user_id)
		//@ts-ignore
        const { error } = await supabase.rpc('like_post', {
            post_target: post_id,
            user_target: user.id
        });
        if (error) {
            console.error('Error liking post:', error);
            return false;
        }

		const { error:notifError } = await supabase.from('notifications').insert(
			{
				user_id: target_user,
				created_at: new Date().toISOString(),
				type: 'likes',
				related_id: post_id,
				creator_id: currentUser.id
			},
		);

		if (notifError) {
			console.log('Error creating like notification', error);
			console.log(notifError)
			return false;
		}

    } else {
		//@ts-ignore
        const { error } = await supabase.rpc('unlike_post', {
			post_target: post_id,
            user_target: user.id
        });
        if (error) {
            console.error('Error unliking post:', error);
            return false;
        }
    }
    return 'success';
}

export async function updateProfile(formData: FormData) {
	let redirectPath: string;

	const displayName = String(formData.get("displayName")).trim();
	const username = String(formData.get("username")).trim();
	const bio = String(formData.get("bio")).trim();

	console.log('display name: ' + displayName)
	console.log('username: ' + username)
	console.log('bio: ' + bio)

	const supabase = createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return getStatusRedirect(
			'/signin',
			'Error!',
			'You need to sign in to update your profile.'
		);
	}

	const { error } = await supabase.from('profiles').update({
		full_name: displayName,
		username: username,
		bio: bio
	}).eq('id', user.id);

	if (error) {
		console.log(error);
		if (error.code === '23505') {
			return redirectPath = getErrorRedirect(
				'/profile/edit',
				'Username',
				'Username is taken'
			);
		} else {
			return redirectPath = getErrorRedirect(
				'/profile/edit',
				'Hmm... Something went wrong.',
				'Your info could not be changed'
			);
		}
	}
	
	return redirectPath = getStatusRedirect(
		`/profile/${username.toLowerCase()}`,
		'Success!',
		'Your info has been changed.',
		true
	);
}

interface User {
	id: string,
	created_at: string,
	username: string,
	full_name: string,
	avatar_url: string,
	bio: string,
	verified: boolean,
	followers: number,
	following: number,
	liked_posts: string[],
}
export async function deletePost(currentUser: User, post_id: string) {
	const supabase = createClient()

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return "Could not validate current user";
	}

	if (user.id !== currentUser.id) {
		return "Credentials do not match";
	}

	const { error } = await supabase.from('posts').delete().eq('id', post_id);

	if (error) {
		console.log(error);
		return "Error deleting post";
	}

	return '';
}

export async function publishPost(formData: FormData) {
	const supabase = createClient()
	const content = String(formData.get("content")).trim();
	let redirectPath: string;

	if (!content || content.trim().length === 0) {
		return getStatusRedirect(
			'/posts/new',
			'Error!',
			'Content cannot be empty.'
		);
	}

	const {
		data: { user },
	} = await supabase.auth.getUser();
	//console.log("user: " + user)

	if (!user) {
		return getStatusRedirect(
			'/signin',
			'Error!',
			'You need to sign in to create a post.'
		);
	}

	if (content.length > 240) {
		return getStatusRedirect(
			'/posts/new',
			'Error!',
			'Content must be shorter than 240 characters'
		);
	}

	const postId = uuidv4();
	const { error } = await supabase.from('posts').insert([
		{
			id: postId,
			content,
			user_id: user.id,
			created_at: new Date().toISOString(),
		},
	]);

	if (error) {
		console.log(error)
		return getStatusRedirect(
			'/posts/new',
			'Error!',
			'Failed to publish post.',
			true
		);
	}

	return redirectPath = getStatusRedirect(
		'/home',
		'Success!',
		'Your post has been published.',
		true
	);

	//return redirectPath;
}

export async function signInWithEmail(formData: FormData) {
	const cookieStore = cookies();
	const callbackURL = getURL('/auth/callback');

	const email = String(formData.get('email')).trim();
	let redirectPath: string;

	if (!isValidEmail(email)) {
		redirectPath = getErrorRedirect(
			'/signin/email_signin',
			'Invalid email address.',
			'Please try again.'
		);
	}

	const supabase = createClient();
	let options = {
		emailRedirectTo: callbackURL,
		shouldCreateUser: true
	};

	// If allowPassword is false, do not create a new user
	const { allowPassword } = getAuthTypes();
	if (allowPassword) options.shouldCreateUser = false;
		const { data, error } = await supabase.auth.signInWithOtp({
			email,
			options: options
	});

	if (error) {
		redirectPath = getErrorRedirect(
			'/signin/email_signin',
			'You could not be signed in.',
			error.message
		);
	} else if (data) {
		cookieStore.set('preferredSignInView', 'email_signin', { path: '/' });
		redirectPath = getStatusRedirect(
			'/signin/email_signin',
			'Success!',
			'Please check your email for a magic link. You may now close this tab.',
			true
		);
	} else {
		redirectPath = getErrorRedirect(
			'/signin/email_signin',
			'Hmm... Something went wrong.',
			'You could not be signed in.'
		);
	}

	return redirectPath;
}

export async function requestPasswordUpdate(formData: FormData) {
	const callbackURL = getURL('/auth/reset_password');

	// Get form data
	const email = String(formData.get('email')).trim();
	let redirectPath: string;

	if (!isValidEmail(email)) {
		redirectPath = getErrorRedirect(
			'/signin/forgot_password',
			'Invalid email address.',
			'Please try again.'
		);
  	}

	const supabase = createClient();

	const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
		redirectTo: callbackURL
	});

	if (error) {
		redirectPath = getErrorRedirect(
			'/signin/forgot_password',
			error.message,
			'Please try again.'
		);
	} else if (data) {
		redirectPath = getStatusRedirect(
			'/signin/forgot_password',
			'Success!',
			'Please check your email for a password reset link. You may now close this tab.',
			true
		);
	} else {
		redirectPath = getErrorRedirect(
			'/signin/forgot_password',
			'Hmm... Something went wrong.',
			'Password reset email could not be sent.'
		);
	}

  	return redirectPath;
}

export async function signInWithPassword(formData: FormData) {
	const cookieStore = cookies();
	const email = String(formData.get('email')).trim();
	const password = String(formData.get('password')).trim();
	let redirectPath: string;

	const supabase = createClient();
	const { error, data } = await supabase.auth.signInWithPassword({
		email,
		password
	});

	if (error) {
		redirectPath = getErrorRedirect(
			'/signin',
			'Sign in failed.',
			error.message
		);
	} else if (data.user) {
		cookieStore.set('preferredSignInView', 'password_signin', { path: '/home' });
		redirectPath = getStatusRedirect('/home', 'Success!', );
	} else {
		redirectPath = getErrorRedirect(
			'/signin',
			'Hmm... Something went wrong.',
			'You could not be signed in.'
		);
	}

	return redirectPath;
}

const DEFAULT_AVATAR_PATH = "/images/default-avatar.png";
export async function signUp(formData: FormData) {
	const callbackURL = getURL('/auth/callback');
	const cookieStore = cookies();

	const email = String(formData.get('email')).trim();
	const password = String(formData.get('password')).trim();
	const username = String(formData.get('username')).trim().toLowerCase();
    const displayName = String(formData.get('displayName')).trim();
	let redirectPath: string;

	if (!isValidEmail(email)) {
		redirectPath = getErrorRedirect(
			'/signin/signup',
			'Invalid email address.',
			'Please try again.'
		);
	}

	const supabase = createClient();

	console.log(username)
	const {data:userData, error:userError} = await supabase.from("profiles").select("*").eq("username", username).single();

	if (userData || !userError) {
		return redirectPath = getErrorRedirect(
			'/signin/signup',
			'Sign up failed.',
			'This username is already in use'
		);
	} 
	

	const { error, data } = await supabase.auth.signUp({
		email,
		password,
		// options: {
		// 	emailRedirectTo: callbackURL
		// }
	});

	if (error) {
		redirectPath = getErrorRedirect(
			'/signin/signup',
			'Sign up failed.',
			error.message
		);
	} else if (
		data.user &&
		data.user.identities &&
		data.user.identities.length == 0
	) {
		redirectPath = getErrorRedirect(
			'/signin/signup',
			'Sign up failed.',
			'There is already an account associated with this email address. Try resetting your password.'
		);
	} else if (data.user) {
		const { error: userError } = await supabase.from("users").insert([
            {
                id: data.user.id,
                email,
                created_at: new Date().toISOString(),
            }
        ]);

		if (userError) {
            console.error("Error creating profile:", userError);
            return getErrorRedirect('/signin/signup', 'Sign up failed.', 'Profile creation failed.');
        }


		const { error: profileError } = await supabase.from("profiles").insert([
            {
                id: data.user.id,
                username,
                full_name: displayName,
				avatar_url: DEFAULT_AVATAR_PATH,
                created_at: new Date().toISOString(),
            }
        ]);

		if (profileError) {
            console.error("Error creating profile:", profileError);
            return getErrorRedirect('/signin/signup', 'Sign up failed.', 'Profile creation failed.');
        }

		if (data.session) {
			cookieStore.set('preferredSignInView', 'password_signin', { path: '/home' });
			redirectPath = getStatusRedirect('/home', 'Success!', );
		}
		cookieStore.set('preferredSignInView', 'password_signin', { path: '/home' });
		redirectPath = getStatusRedirect(
			'/home',
			'Success!',
			// 'Please check your email for a confirmation link. You may now close this tab.'
		);
	} else {
		redirectPath = getErrorRedirect(
			'/signin/signup',
			'Hmm... Something went wrong.',
			'You could not be signed up.'
		);
	}

	return redirectPath;
}

export async function updatePassword(formData: FormData) {
	const password = String(formData.get('password')).trim();
	const passwordConfirm = String(formData.get('passwordConfirm')).trim();
	let redirectPath: string;

	// Check that the password and confirmation match
	if (password !== passwordConfirm) {
		redirectPath = getErrorRedirect(
			'/signin/update_password',
			'Your password could not be updated.',
			'Passwords do not match.'
		);
	}

	const supabase = createClient();
	const { error, data } = await supabase.auth.updateUser({
		password
	});

	if (error) {
		redirectPath = getErrorRedirect(
			'/signin/update_password',
			'Your password could not be updated.',
		error.message
		);
	} else if (data.user) {
		redirectPath = getStatusRedirect(
			'/',
			'Success!',
			'Your password has been updated.'
		);
	} else {
		redirectPath = getErrorRedirect(
			'/signin/update_password',
			'Hmm... Something went wrong.',
			'Your password could not be updated.'
		);
	}

	return redirectPath;
}

export async function updateEmail(formData: FormData) {
	// Get form data
	const newEmail = String(formData.get('newEmail')).trim();

	// Check that the email is valid
	if (!isValidEmail(newEmail)) {
		return getErrorRedirect(
			'/account',
			'Your email could not be updated.',
			'Invalid email address.'
		);
	}

	const supabase = createClient();

	const callbackUrl = getURL(
		getStatusRedirect('/account', 'Success!', `Your email has been updated.`)
	);

	const { error } = await supabase.auth.updateUser(
		{ email: newEmail },
		{
			emailRedirectTo: callbackUrl
		}
	);

	if (error) {
		return getErrorRedirect(
			'/account',
			'Your email could not be updated.',
			error.message
		);
	} else {
		return getStatusRedirect(
			'/account',
			'Confirmation emails sent.',
			`You will need to confirm the update by clicking the links sent to both the old and new email addresses.`
		);
	}
}

export async function updateName(formData: FormData) {
	// Get form data
	const fullName = String(formData.get('fullName')).trim();

	const supabase = createClient();
	const { error, data } = await supabase.auth.updateUser({
		data: { full_name: fullName }
	});

	if (error) {
		return getErrorRedirect(
			'/account',
			'Your name could not be updated.',
			error.message
		);
	} else if (data.user) {
		return getStatusRedirect(
			'/account',
			'Success!',
			'Your name has been updated.'
		);
	} else {
		return getErrorRedirect(
			'/account',
			'Hmm... Something went wrong.',
			'Your name could not be updated.'
		);
	}
}