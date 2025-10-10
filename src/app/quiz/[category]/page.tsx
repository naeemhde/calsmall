import { notFound } from "next/navigation";
import QuizClient from "./quiz-client";
import { getCategories, getQuestionsForCategory } from "@/data/quiz";

export default function QuizCategoryPage({ params }: { params: { category: string } }) {
  const category = getCategories().find((c) => c.slug === params.category);
  if (!category) return notFound();
  const questions = getQuestionsForCategory(category.slug);
  if (!questions.length) return notFound();

  return <QuizClient category={category} questions={questions} />;
}
