// app/terms/layout.tsx
export default function TermsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <main className="min-h-screen bg-white">{children}</main>;
}
