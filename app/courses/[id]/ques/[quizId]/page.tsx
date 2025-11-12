import QuizClient from '@/components/QuizClient';
import { use } from 'react';

export const dynamic = 'force-static';
export const dynamicParams = false;

// Generate static params for all quiz pages
export async function generateStaticParams() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/courses/courses.json`, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      return [];
    }
    
    const data = await res.json();
    
    // Generate params for all course/quiz combinations
    const params: { id: string; quizId: string }[] = [];
    
    data.courses.forEach((course: any) => {
      course.quizzes.forEach((quiz: any) => {
        params.push({
          id: course.id,
          quizId: quiz.id,
        });
      });
    });
    
    return params;
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default function QuizPage({ params }:
  { params: Promise<{ id: string, quizId: string }> }) {
  const { id, quizId } = use(params);
  return <QuizClient quizId={quizId} courseId={id} />;
}