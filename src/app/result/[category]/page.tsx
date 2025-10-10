import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCategories } from "@/data/quiz";

export default function ResultPage({ params, searchParams }: { params: { category: string }, searchParams: { score?: string, total?: string } }) {
  const category = getCategories().find((c) => c.slug === params.category);
  if (!category) return notFound();
  const score = Number(searchParams.score ?? "0");
  const total = Number(searchParams.total ?? "0");

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-background to-background/60">
      <section className="mx-auto max-w-3xl px-6 py-14">
        <Card className="border-0 bg-card/60 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Results</span>
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: `hsl(${category.accentHue} 80% 50%)` }}
              />
            </CardTitle>
            <CardDescription>{category.title}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="text-5xl font-semibold">{score}<span className="text-muted-foreground">/{total}</span></div>
              <div className="h-3 w-full rounded-full bg-secondary/50">
                <div
                  className="h-3 rounded-full"
                  style={{ width: `${total ? Math.round((score / total) * 100) : 0}%`, backgroundColor: `hsl(${category.accentHue} 80% 50%)` }}
                />
              </div>
            </div>
            <p className="text-muted-foreground">Nice work! You can retry this category or pick another one.</p>
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Button variant="ghost" asChild>
              <Link href="/">All categories</Link>
            </Button>
            <Button asChild>
              <Link href={`/quiz/${category.slug}`}>Retake</Link>
            </Button>
          </CardFooter>
        </Card>
      </section>
    </main>
  );
}
