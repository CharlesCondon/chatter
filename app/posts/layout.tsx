import { UserProvider } from "@/components/UserContext";

// app/posts/layout.tsx
export default function PostsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <UserProvider>
            <section>{children}</section>;
        </UserProvider>
    );
}
