"use client";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCategories } from "@/data/quiz";

export default function Home() {
  const categories = getCategories();
  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-background to-background/60">
      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">MCQ Quiz</h1>
            <p className="mt-2 text-muted-foreground">Choose a category to begin. Each has 5 questions.</p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <Card
              key={cat.slug}
              className="group overflow-hidden border-0 bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/50 shadow-lg"
              style={{
                backgroundImage: `radial-gradient(1200px 300px at 0% 0%, hsl(${cat.accentHue} 90% 35% / 0.12), transparent 60%), radial-gradient(900px 250px at 100% 100%, hsl(${cat.accentHue} 90% 55% / 0.10), transparent 60%)`,
              }}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <span>{cat.title}</span>
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: `hsl(${cat.accentHue} 80% 50%)` }}
                  />
                </CardTitle>
                <CardDescription>{cat.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-2 w-full rounded-full bg-secondary/50">
                  <div
                    className="h-2 rounded-full"
                    style={{ width: `40%`, backgroundColor: `hsl(${cat.accentHue} 80% 50%)` }}
                  />
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button asChild>
                  <Link href={`/quiz/${cat.slug}`}>Start</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
