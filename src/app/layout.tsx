import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'Modern MCQ Quiz',
  description: 'A sleek, category-based multiple-choice quiz app.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6">
            <Link href="/" className="font-semibold tracking-tight">Modern MCQ</Link>
            <nav className="text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">Categories</Link>
            </nav>
          </div>
        </header>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
