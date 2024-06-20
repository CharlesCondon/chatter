import Link from "next/link";

export default async function PostsPage() {
    return (
        <main className="p-10 flex flex-col gap-5 min-h-screen">
            <Link href={"/home"}>{"<"}-</Link>
            <div className="flex gap-4">
                <div className="mt-2">
                    <img src="" alt="" />
                    <h1>img</h1>
                </div>
                <textarea
                    rows={7}
                    placeholder="What's going on?"
                    className="resize-none flex-1 p-2"
                ></textarea>
            </div>
            <button className="border border-black rounded bg-white">
                POST
            </button>
        </main>
    );
}
