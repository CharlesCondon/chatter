"use client";
import Link from "next/link";
import Image from "next/image";
import homeImg from "@/components/icons/home.png";
import searchImg from "@/components/icons/search.png";
import notifImg from "@/components/icons/bell.png";
import dmImg from "@/components/icons/send.png";
import profileImg from "@/components/icons/user.png";
import { useUser } from "@/components/UserContext";

export default function Navbar() {
    const { profile } = useUser();
    //console.log(profile);

    return (
        <nav className="flex flex-row items-center justify-between p-4 fixed  bottom-0 w-screen border-[var(--accent-light)] border-t">
            <Link href={"/home"}>
                <Image src={homeImg} width={25} height={25} alt="Home" />
            </Link>
            {/* <Link href={"/explore"}>
                <Image src={searchImg} width={23} height={23} alt="Explore" />
            </Link> */}
            <Link href={"/notifications"}>
                <Image
                    src={notifImg}
                    width={27}
                    height={27}
                    alt="Notifications"
                />
            </Link>
            {/* <Link href={"/messages"}>
                <Image src={dmImg} width={25} height={25} alt="Messages" />
            </Link> */}
            <Link href={profile ? `/profile/${profile.username}` : "/home"}>
                <Image src={profileImg} width={25} height={25} alt="Profile" />
            </Link>
        </nav>
    );
}
