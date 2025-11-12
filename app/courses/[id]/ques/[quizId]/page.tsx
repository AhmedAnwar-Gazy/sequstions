import path from "path";
import fs from "fs/promises";
import QuizClient from "@/components/QuizClient";
import { use } from "react";

export const dynamic = "force-static";
export const dynamicParams = false;

// ✅ Generate static params for all course quizzes
export async function generateStaticParams() {
  try {
    const filePath = path.join(process.cwd(), "public", "courses", "courses.json");
    const fileContents = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(fileContents);

    // Assuming structure like: data.courses = [{ id, quizzes: [{ id, ...}] }]
    const params = data.courses.flatMap((course: any) =>
      (course.quizzes || []).map((quiz: any) => ({
        id: course.id.toString(),
        quizId: quiz.id.toString(),
      }))
    );

    return params;
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default function QuizPage({
  params,
}: {
  params: Promise<{ id: string; quizId: string }>;
}) {
  const { id, quizId } = use(params);
  return <QuizClient quizId={quizId} courseId={id} />;
}
