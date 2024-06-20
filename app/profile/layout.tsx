// app/posts/layout.tsx
export default function PostsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section>
            <h2>Profile Sections</h2>
            {children}
        </section>
    );
}
