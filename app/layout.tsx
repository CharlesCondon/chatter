import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { UserProvider } from "@/components/UserContext";
import "../styles/globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Chatter",
    description: "The platform for positivity!",
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <UserProvider>
            <html lang="en">
                <body className={inter.className}>{children}</body>
                <GoogleAnalytics gaId="G-1HWYXTK6TZ" />
            </html>
        </UserProvider>
    );
}
