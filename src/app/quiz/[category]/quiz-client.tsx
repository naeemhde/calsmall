"use client";
import * as React from "react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { type QuizCategory, type QuizQuestion } from "@/data/quiz";
import Link from "next/link";

function useShuffled<T>(items: T[], seed?: number): T[] {
  return useMemo(() => {
    const array = [...items];
    let currentIndex = array.length;
    let s = seed ?? 1337;
    function rand() {
      s ^= s << 13; s ^= s >>> 17; s ^= s << 5; // xorshift32-ish
      return (s >>> 0) / 0xffffffff;
    }
    while (currentIndex !== 0) {
      const randomIndex = Math.floor(rand() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  }, [items, seed]);
}

export default function QuizClient({ category, questions }: { category: QuizCategory; questions: QuizQuestion[] }) {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const currentQuestion = questions[current];
  const shuffledChoices = useShuffled(currentQuestion.choices, current);
  const selectedChoiceId = answers[currentQuestion?.id];
  const isLast = current === questions.length - 1;
  const answeredCount = Object.keys(answers).length;

  function selectAnswer(choiceId: string) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: choiceId }));
  }

  function next() {
    if (current < questions.length - 1) setCurrent((c) => c + 1);
  }
  function prev() {
    if (current > 0) setCurrent((c) => c - 1);
  }

  function submit() {
    setSubmitted(true);
  }

  const score = useMemo(() => {
    return questions.reduce((acc, q) => acc + (answers[q.id] === q.correctChoiceId ? 1 : 0), 0);
  }, [answers, questions]);

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-background to-background/60">
      <section className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="text-sm text-muted-foreground hover:underline">
            ← Categories
          </Link>
          <div className="flex items-center gap-3">
            <div className="text-sm text-muted-foreground">{answeredCount}/{questions.length} answered</div>
            <div
              className="h-2 w-32 rounded-full bg-secondary/50"
              aria-label="progress"
            >
              <div
                className="h-2 rounded-full"
                style={{
                  width: `${Math.round((answeredCount / questions.length) * 100)}%`,
                  backgroundColor: `hsl(${category.accentHue} 80% 50%)`,
                }}
              />
            </div>
          </div>
        </div>

        <Card className="border-0 bg-card/60 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{category.title}</span>
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: `hsl(${category.accentHue} 80% 50%)` }}
              />
            </CardTitle>
            <CardDescription>
              Question {current + 1} of {questions.length}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-base leading-relaxed">{currentQuestion.prompt}</p>

            <div className="space-y-3">
              {shuffledChoices.map((choice) => {
                const isCorrect = submitted && choice.id === currentQuestion.correctChoiceId;
                const isWrong = submitted && selectedChoiceId === choice.id && !isCorrect;
                return (
                  <button
                    key={choice.id}
                    onClick={() => selectAnswer(choice.id)}
                    className={
                      "w-full text-left rounded-md border p-4 transition-colors focus:outline-none " +
                      (selectedChoiceId === choice.id && !submitted
                        ? "border-[hsl(var(--ring))] bg-accent/40"
                        : "hover:bg-accent/30") +
                      (isCorrect ? " border-green-600/70 bg-green-600/15" : "") +
                      (isWrong ? " border-red-600/70 bg-red-600/15" : "")
                    }
                    disabled={submitted}
                  >
                    {choice.text}
                  </button>
                );
              })}
            </div>

            {submitted && currentQuestion.explanation && (
              <div className="rounded-md border border-amber-400/50 bg-amber-500/10 p-3 text-sm text-amber-200">
                {currentQuestion.explanation}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Score: {score}/{questions.length}
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={prev} disabled={current === 0}>
                Previous
              </Button>
              {!submitted && !isLast && (
                <Button onClick={next} disabled={!selectedChoiceId}>
                  Next
                </Button>
              )}
              {!submitted && isLast && (
                <Button onClick={submit} disabled={answeredCount < questions.length}>
                  Submit
                </Button>
              )}
              {submitted && (
                <Button
                  onClick={() => router.push(`/result/${category.slug}?score=${score}&total=${questions.length}`)}
                >
                  View result
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </section>
    </main>
  );
}
