"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
    display: string;
    user: string;
    time: string;
    content: string;
    avi: string;
    id: string;
}

export default function Post({ display, user, time, content, avi, id }: Props) {
    const router = useRouter();

    const navigateToPost = () => {
        router.push(`/posts/${id}`);
    };

    const testPostBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        e.preventDefault;
        alert("test btn");
    };

    return (
        <div
            onClick={navigateToPost}
            className="flex flex-row p-4 border-b border-black gap-2"
        >
            <div className="pt-0.5">
                <img src={avi} alt="" />
                <p>img</p>
            </div>
            <div className="flex-1">
                <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-row gap-2 items-center">
                        <Link href={`/profile/${user}`}>{display}</Link>
                        <p>@{user}</p>
                        <p>{time}</p>
                    </div>

                    <button className="pb-2">...</button>
                </div>
                <p>{content}</p>
                <div className="flex justify-between">
                    <button onClick={testPostBtn} className="">
                        Comment
                    </button>
                    <button onClick={testPostBtn} className="">
                        Like
                    </button>
                    <button onClick={testPostBtn} className="">
                        Share
                    </button>
                </div>
            </div>
        </div>
    );
}
