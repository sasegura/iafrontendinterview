'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FileText, Bot, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { InterviewHistoryItem, Recommendations } from '@/lib/definitions';
import { getRecommendations } from '@/lib/actions';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import ResultsLoading from './loading';

export function ResultsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  
  const [score, setScore] = useState<number>(0);
  const [topic, setTopic] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('');
  const [history, setHistory] = useState<InterviewHistoryItem[]>([]);
  const [finalLevel, setFinalLevel] = useState<string>('');
  const [recommendations, setRecommendations] = useState<Recommendations | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This code runs only on the client-side
    const loadResults = () => {
      try {
        const storedHistory = localStorage.getItem('interviewHistory');
        const urlScore = searchParams.get('score');
        const urlTopic = searchParams.get('topic');
        const urlDifficulty = searchParams.get('difficulty');
        
        if (!storedHistory || !urlScore || !urlTopic || !urlDifficulty) {
          toast({ title: "Results not found", description: "No interview data available. Redirecting home.", variant: "destructive" });
          router.push('/');
          return;
        }
        
        const parsedHistory: InterviewHistoryItem[] = JSON.parse(storedHistory);
        setHistory(parsedHistory);
        setScore(parseInt(urlScore, 10));
        setTopic(urlTopic);
        setDifficulty(urlDifficulty);
        
        if (parsedHistory.length > 0) {
          const lastLevel = parsedHistory[parsedHistory.length - 1].feedback.estimatedLevel;
          setFinalLevel(lastLevel);

          const intervieweeResponse = parsedHistory.map(item => `Q: ${item.question}\nA: ${item.answer}`).join('\n\n');
          const feedbackSummary = parsedHistory.map(item => `Feedback for "${item.question}": ${item.feedback.evaluation} Strengths: ${item.feedback.strengths}. Areas for improvement: ${item.feedback.areasForImprovement}.`).join('\n');
          
          startTransition(async () => {
            const recsResponse = await getRecommendations({
              intervieweeResponse,
              feedback: feedbackSummary,
              topic: urlTopic,
              difficultyLevel: lastLevel
            });
            if (recsResponse.success && recsResponse.data) {
              setRecommendations(recsResponse.data);
            } else {
              toast({ title: "Could not get recommendations", description: recsResponse.error, variant: "destructive" });
            }
          });
        } else {
          setFinalLevel(urlDifficulty); // Fallback to initial difficulty
        }

      } catch (e) {
        toast({ title: "Error loading results", description: "Data might be corrupted. Redirecting home.", variant: "destructive" });
        router.push('/');
      } finally {
          setIsLoading(false);
      }
    }
    loadResults();
  }, []); // Run once on mount

  if (isLoading) {
    return <ResultsLoading />;
  }

  return (
    <div className="container mx-auto max-w-5xl py-12 px-4 md:px-6">
      <div className="space-y-4 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl">Interview Complete!</h1>
        <p className="text-xl text-muted-foreground">Here's a summary of your performance.</p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Final Score</CardTitle></CardHeader>
          <CardContent><p className="text-5xl font-bold text-primary">{score}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Estimated Level</CardTitle></CardHeader>
          <CardContent><Badge className="text-2xl" variant="default">{finalLevel}</Badge></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Interview Details</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Badge variant="secondary">Topic: {topic}</Badge>
            <Badge variant="secondary">Difficulty: {difficulty}</Badge>
          </CardContent>
        </Card>
      </div>

      <div className="mt-16 space-y-8">
        <div>
          <h2 className="font-headline text-3xl font-bold flex items-center gap-2 mb-4">
            <BookOpen/>
            Study Recommendations
          </h2>
          <Card className="bg-primary/5">
            <CardContent className="p-6">
              {isPending ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ) : recommendations ? (
                <p className="whitespace-pre-wrap">{recommendations.studyRecommendations}</p>
              ) : (
                <p>Could not generate recommendations at this time.</p>
              )}
            </CardContent>
          </Card>
        </div>
      
        <div>
          <h2 className="font-headline text-3xl font-bold flex items-center gap-2 mb-4">
            <FileText/>
            Full Transcript
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {history.map((item, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-lg font-semibold">Question {index + 1}: <span className="text-left font-normal ml-2">{item.question}</span></AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <Alert>
                    <Bot className="h-4 w-4" />
                    <AlertTitle>Your Answer</AlertTitle>
                    <AlertDescription className="whitespace-pre-wrap">{item.answer}</AlertDescription>
                  </Alert>
                  <Card>
                    <CardHeader><CardTitle className="text-base">Feedback</CardTitle></CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <p><strong>Evaluation:</strong> {item.feedback.evaluation}</p>
                      <p><strong>Strengths:</strong> {item.feedback.strengths}</p>
                      <p><strong>Areas for Improvement:</strong> {item.feedback.areasForImprovement}</p>
                      <p><strong>Level:</strong> <Badge variant="outline">{item.feedback.estimatedLevel}</Badge></p>
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
      
      <div className="mt-16 text-center">
        <Button asChild size="lg">
          <Link href="/">
            Try Another Interview
          </Link>
        </Button>
      </div>
    </div>
  );
}
