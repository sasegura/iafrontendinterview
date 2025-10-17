'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import type { Difficulty, Topic, Evaluation, InterviewHistoryItem } from '@/lib/definitions';
import { getInitialQuestion, evaluateAnswer } from '@/lib/actions';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowRight, CheckCircle, XCircle, BrainCircuit, Star, Trophy, Lightbulb } from 'lucide-react';
import InterviewLoading from './loading';

const AnswerSchema = z.object({
  answer: z.string().min(10, { message: 'Please provide a more detailed answer.' }),
});

export function InterviewClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [topic, setTopic] = useState<Topic | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);

  const [question, setQuestion] = useState<string>('');
  const [history, setHistory] = useState<InterviewHistoryItem[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<Evaluation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFinishing, setIsFinishing] = useState(false);

  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: { answer: '' },
  });

  useEffect(() => {
    const t = searchParams.get('topic') as Topic;
    const d = searchParams.get('difficulty') as Difficulty;
    if (!t || !d) {
      toast({
        title: 'Missing Parameters',
        description: 'Topic or difficulty not selected. Redirecting to home.',
        variant: 'destructive',
      });
      router.push('/');
      return;
    }
    setTopic(t);
    setDifficulty(d);

    setIsLoading(true);
    startTransition(async () => {
      const response = await getInitialQuestion({ techStack: t, difficultyLevel: d });
      if (response.success && response.data) {
        setQuestion(response.data.question);
      } else {
        toast({
          title: 'Error',
          description: response.error,
          variant: 'destructive',
        });
        router.push('/');
      }
      setIsLoading(false);
    });
  }, [router, searchParams, toast]);

  const onSubmit = (data: z.infer<typeof AnswerSchema>) => {
    if (!topic || !difficulty) return;
    
    setIsLoading(true);
    startTransition(async () => {
      const response = await evaluateAnswer({
        topic: topic,
        question: question,
        userAnswer: data.answer,
      });

      if (response.success && response.data) {
        setFeedback(response.data);
        setScore(prev => prev + response.data.points);
        setHistory(prev => [...prev, { question, answer: data.answer, feedback: response.data! }]);
        setQuestion(response.data.nextQuestion);
        form.reset();
      } else {
        toast({
          title: 'Evaluation Error',
          description: response.error,
          variant: 'destructive',
        });
      }
      setIsLoading(false);
    });
  };

  const handleNextQuestion = () => {
    setFeedback(null);
  };
  
  const handleFinishInterview = () => {
    setIsFinishing(true);
    try {
      localStorage.setItem('interviewHistory', JSON.stringify(history));
      
      const params = new URLSearchParams({
        score: score.toString(),
        topic: topic ?? 'Unknown',
        difficulty: difficulty ?? 'Unknown',
      });
      router.push(`/results?${params.toString()}`);

    } catch (error) {
      toast({
        title: 'Error Finishing Interview',
        description: 'Could not save results to local storage. Your browser might not support it or be in private mode.',
        variant: 'destructive',
      });
      setIsFinishing(false);
    }
  };


  if (isLoading && history.length === 0) {
    return <InterviewLoading />;
  }

  const progressValue = Math.min((history.length / 10) * 100, 100); // Assuming 10 questions per interview

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 md:px-6">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <h1 className="font-headline text-3xl font-bold">Interview in Progress</h1>
            <div className="flex gap-2">
              <Badge variant="secondary">{topic}</Badge>
              <Badge variant="secondary">{difficulty}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-2 text-2xl font-bold text-primary">
            <Trophy className="h-6 w-6" />
            <span>Score: {score}</span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-2">
            <Progress value={progressValue} className="w-full" />
            <p className="text-sm text-muted-foreground">{history.length} of approx. 10 questions answered</p>
        </div>


        {/* Main Content */}
        <div>
          {feedback ? (
            // Feedback View
            <div
              key="feedback"
              className="animate-in fade-in-0 zoom-in-95"
            >
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl flex items-center gap-2">
                    <BrainCircuit className="text-primary"/>
                    Feedback on Your Answer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Alert>
                        <Lightbulb className="h-4 w-4" />
                        <AlertTitle>Evaluation</AlertTitle>
                        <AlertDescription>{feedback.evaluation}</AlertDescription>
                    </Alert>

                    <div className="grid md:grid-cols-2 gap-4">
                        <Alert variant="default" className="border-green-500/50">
                            <CheckCircle className="h-4 w-4 text-green-500"/>
                            <AlertTitle className="text-green-600">Strengths</AlertTitle>
                            <AlertDescription>{feedback.strengths}</AlertDescription>
                        </Alert>
                        <Alert variant="destructive">
                            <XCircle className="h-4 w-4"/>
                            <AlertTitle>Areas for Improvement</AlertTitle>
                            <AlertDescription>{feedback.areasForImprovement}</AlertDescription>
                        </Alert>
                    </div>

                    <div className="flex justify-between items-center bg-muted p-4 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Star className="h-5 w-5 text-yellow-500"/>
                            <span className="font-semibold">Estimated Level for this question:</span>
                        </div>
                        <Badge variant="default" className="text-lg">{feedback.estimatedLevel}</Badge>
                    </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button onClick={handleNextQuestion} className="w-full sm:w-auto" disabled={isPending || isLoading}>
                      Next Question <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button onClick={handleFinishInterview} variant="outline" className="w-full sm:w-auto" disabled={isPending || isFinishing || isLoading}>
                      {isFinishing ? <Loader2 className="animate-spin" /> : 'Finish Interview'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            // Question View
            <div
              key="question"
              className="animate-in fade-in-0 zoom-in-95"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">Question {history.length + 1}</CardTitle>
                  <CardDescription className="text-lg pt-2">{question}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="answer"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="sr-only">Your Answer</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Type your detailed answer here..."
                                className="min-h-[150px] text-base"
                                disabled={isPending || isLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-between">
                        <Button type="submit" disabled={isPending || isLoading}>
                          {(isPending || isLoading) ? <Loader2 className="animate-spin" /> : 'Submit Answer'}
                        </Button>
                        {history.length > 0 && (
                          <Button onClick={handleFinishInterview} variant="ghost" disabled={isPending || isFinishing || isLoading}>
                            {isFinishing ? <Loader2 className="animate-spin" /> : 'Finish Now'}
                          </Button>
                        )}
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
