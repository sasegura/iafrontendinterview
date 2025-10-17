'use client';

import { useState, useEffect, useTransition, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import type { Difficulty, Topic, Evaluation, InterviewHistoryItem, InitialQuestion } from '@/lib/definitions';
import { getNextQuestion, evaluateAnswer } from '@/lib/actions';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowRight, CheckCircle, XCircle, BrainCircuit, Star, Trophy, Lightbulb } from 'lucide-react';
import InterviewLoading from './loading';
import FeedbackLoading from './feedback-loading';

const INTERVIEW_LENGTH = 10;
const POINTS_PER_QUESTION = 10;

export function InterviewClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [topic, setTopic] = useState<Topic | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  
  const [currentQuestion, setCurrentQuestion] = useState<InitialQuestion | null>(null);
  const [history, setHistory] = useState<InterviewHistoryItem[]>([]);
  
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<Evaluation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isFinishing, setIsFinishing] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);

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
    
    // Reset all state for a new interview
    setCurrentQuestion(null);
    setHistory([]);
    setScore(0);
    setFeedback(null);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setIsLoading(true);
    setIsInitializing(true);

    startTransition(async () => {
      const response = await getNextQuestion({ techStack: t, difficultyLevel: d, previousQuestions: [] });
      if (response.success && response.data) {
        setCurrentQuestion(response.data);
      } else {
        toast({
          title: 'Error',
          description: response.error,
          variant: 'destructive',
        });
        router.push('/');
      }
      setIsInitializing(false);
      setIsLoading(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnswerSubmit = (answer: string) => {
    if (!topic || !difficulty || !currentQuestion) return;
    
    setSelectedAnswer(answer);
    setIsAnswerSubmitted(true);
    setIsLoading(true);

    startTransition(async () => {
      const isCorrect = answer === currentQuestion.answer;
      const points = isCorrect ? POINTS_PER_QUESTION : 0;
      
      const response = await evaluateAnswer({
        topic: topic,
        question: currentQuestion.question,
        userAnswer: answer,
      });

      if (response.success && response.data) {
        const evaluationWithPoints = { ...response.data, points };
        setFeedback(evaluationWithPoints);
        setScore(prev => prev + points);
        setHistory(prev => [...prev, { 
          question: currentQuestion.question, 
          answer: answer, 
          feedback: evaluationWithPoints,
          options: currentQuestion.options,
          correctAnswer: currentQuestion.answer,
        }]);
      } else {
        toast({
          title: 'Evaluation Error',
          description: response.error,
          variant: 'destructive',
        });
         const fallbackFeedback: Evaluation = {
            evaluation: 'Could not evaluate your answer.',
            strengths: 'N/A',
            areasForImprovement: 'N/A',
            estimatedLevel: difficulty,
            nextQuestion: "Let's move to the next question.",
            points: points,
        };
        setFeedback(fallbackFeedback);
        setScore(prev => prev + points);
        setHistory(prev => [...prev, {
            question: currentQuestion.question,
            answer: answer,
            feedback: fallbackFeedback,
            options: currentQuestion.options,
            correctAnswer: currentQuestion.answer,
        }]);
      }
      setIsLoading(false);
    });
  };

  const handleNextQuestion = () => {
    if (!topic || !difficulty) return;
    
    setIsLoading(true);
    setCurrentQuestion(null);
    setFeedback(null);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);

    if (history.length < INTERVIEW_LENGTH) {
       startTransition(async () => {
        const previousQuestions = history.map(h => h.question);
        
        const response = await getNextQuestion({ techStack: topic, difficultyLevel: difficulty, previousQuestions });
        if (response.success && response.data) {
          setCurrentQuestion(response.data);
        } else {
          toast({
            title: 'Error',
            description: response.error,
            variant: 'destructive',
          });
        }
        setIsLoading(false);
      });
    } else {
      handleFinishInterview();
    }
  };
  
  const handleFinishInterview = () => {
    setIsFinishing(true);
    try {
      if (history.length === 0) {
        router.push('/');
        return;
      }
      
      localStorage.setItem('interviewHistory', JSON.stringify(history));
      
      const maxScore = history.length * POINTS_PER_QUESTION;
      const params = new URLSearchParams({
        score: score.toString(),
        maxScore: maxScore.toString(),
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


  if (isInitializing || (!currentQuestion && isLoading)) {
    return <InterviewLoading />;
  }

  const progressValue = Math.min((history.length / INTERVIEW_LENGTH) * 100, 100);

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
            <p className="text-sm text-muted-foreground">{history.length} of {INTERVIEW_LENGTH} questions answered</p>
        </div>


        {/* Main Content */}
        <div>
          {feedback || (isAnswerSubmitted && isLoading) ? (
            isLoading ? <FeedbackLoading /> : (
              // Feedback View
              <div
                key={`feedback-${history.length}`}
                className="animate-in fade-in-0 zoom-in-95"
              >
                <Card className="bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="font-headline text-2xl flex items-center gap-2">
                      <BrainCircuit className="text-primary"/>
                      Feedback
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                      {feedback ? (
                        <>
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
                        </>
                      ) : null}
  
                    <div className="flex flex-col sm:flex-row gap-4">
                      {history.length < INTERVIEW_LENGTH ? (
                          <Button onClick={handleNextQuestion} className="w-full sm:w-auto" disabled={isPending || isLoading}>
                              Next Question <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                      ) : null}
                       <Button onClick={handleFinishInterview} variant={history.length < INTERVIEW_LENGTH ? 'outline' : 'default'} className="w-full sm:w-auto" disabled={isPending || isFinishing || isLoading}>
                        {isFinishing ? <Loader2 className="animate-spin" /> : 'Finish Interview'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )
          ) : currentQuestion ? (
            // Question View
            <div
              key={`question-${history.length}`}
              className="animate-in fade-in-0 zoom-in-95"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">Question {history.length + 1}</CardTitle>
                  <CardDescription className="text-lg pt-2">{currentQuestion?.question}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentQuestion?.options.map((option, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="lg"
                        className="h-auto whitespace-normal justify-start text-left p-4"
                        onClick={() => handleAnswerSubmit(option)}
                        disabled={isPending || isLoading}
                      >
                        <span className="font-bold mr-2">{String.fromCharCode(65 + index)}.</span>
                        {option}
                      </Button>
                    ))}
                  </div>
                  <div className="flex justify-end mt-6">
                      <Button onClick={handleFinishInterview} variant="outline" disabled={isPending || isFinishing || isLoading}>
                        {isFinishing ? <Loader2 className="animate-spin" /> : 'Finish Interview'}
                      </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
