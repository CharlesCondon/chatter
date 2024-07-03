"use client";
import Link from "next/link";
import Image from "next/image";
import homeImg from "@/components/icons/home.png";
import homeActive from "@/components/icons/homeActive.png";
import searchImg from "@/components/icons/search.png";
import searchActive from "@/components/icons/searchActive.png";
import notifImg from "@/components/icons/bell.png";
import notifActive from "@/components/icons/notifActive.png";
import dmImg from "@/components/icons/send.png";
import profileImg from "@/components/icons/user.png";
import profileActive from "@/components/icons/profileActive.png";
import { fetchUser } from "@/lib/auth-helpers/server";
import { useUser } from "@/components/UserContext";

interface NavbarProps {
    activePage: string;
}

export default function Navbar({ activePage }: NavbarProps) {
    const { profile } = useUser();
    //console.log(profile);

    return (
        <nav className="flex flex-row items-center justify-between p-4 fixed  bottom-0 w-screen border-[var(--accent-light)] border-t">
            <Link href={"/home"}>
                <Image
                    src={activePage === "home" ? homeActive : homeImg}
                    width={25}
                    height={25}
                    alt="Home"
                />
            </Link>
            <Link href={"/explore"}>
                <Image
                    src={activePage === "explore" ? searchActive : searchImg}
                    width={23}
                    height={23}
                    alt="Explore"
                />
            </Link>
            <Link href={"/notifications"}>
                <Image
                    src={activePage === "notif" ? notifActive : notifImg}
                    width={27}
                    height={27}
                    alt="Notifications"
                />
            </Link>
            {/* <Link href={"/messages"}>
                <Image src={dmImg} width={25} height={25} alt="Messages" />
            </Link> */}
            <Link href={profile ? `/profile/${profile.username}` : "/home"}>
                <Image
                    src={activePage === "profile" ? profileActive : profileImg}
                    width={25}
                    height={25}
                    alt="Profile"
                />
            </Link>
        </nav>
    );
}
