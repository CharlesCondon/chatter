import Link from "next/link";

export default async function PostsPage() {
    return (
        <main className="p-10 flex flex-col gap-5 min-h-screen">
            <h1 className="text-5xl text-center">Sign Up</h1>
            <form className="flex flex-col gap-2 ">
                <input
                    required
                    type="email"
                    placeholder="Email"
                    className="p-2"
                ></input>
                <input
                    required
                    type="text"
                    placeholder="Display Name"
                    className="p-2"
                ></input>
                <input
                    required
                    type="text"
                    placeholder="Username"
                    className="p-2"
                ></input>
                <input
                    required
                    type="password"
                    placeholder="Password"
                    className="p-2"
                ></input>
                <input
                    required
                    type="password"
                    placeholder="Confirm Password"
                    className="p-2"
                ></input>
                <button type="submit" className="border border-black rounded">
                    Submit
                </button>
            </form>
            <Link href={"/login"}>Log In</Link>
        </main>
    );
}
