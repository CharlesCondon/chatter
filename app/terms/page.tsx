// app/terms/page.tsx
import help from "@/public/help.jpg";
import Image from "next/image";

export default async function Home() {
    //@ts-ignore

    return (
        <div className="w-full h-screen flex justify-center items-center">
            <Image src={help} alt={""} width={200} height={200} />
        </div>
    );
}
