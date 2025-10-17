import { Suspense } from 'react';
import { ResultsClient } from './results-client';
import { Header } from '@/components/header';
import ResultsLoading from './loading';

export default function ResultsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-background/50">
        <Suspense fallback={<ResultsLoading />}>
          <ResultsClient />
        </Suspense>
      </main>
       <footer className="flex items-center justify-center py-6 border-t">
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Front-End Interview Ace</p>
      </footer>
    </div>
  );
}
