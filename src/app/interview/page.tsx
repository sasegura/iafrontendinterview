import { Suspense } from 'react';
import { InterviewClient } from './interview-client';
import { Header } from '@/components/header';
import InterviewLoading from './loading';

export default function InterviewPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<InterviewLoading />}>
          <InterviewClient />
        </Suspense>
      </main>
    </div>
  );
}
