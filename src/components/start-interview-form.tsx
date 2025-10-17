'use client';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Rocket } from 'lucide-react';
import type { Difficulty, Topic } from '@/lib/definitions';

const topics: { value: Topic, label: string }[] = [
  { value: 'React', label: 'React' },
  { value: 'JavaScript', label: 'JavaScript' },
  { value: 'HTML/CSS', label: 'HTML/CSS' },
  { value: 'Testing', label: 'Testing' },
  { value: 'Random', label: 'Random' },
];

const difficulties: { value: Difficulty, label: string }[] = [
  { value: 'Junior', label: 'Junior' },
  { value: 'Mid', label: 'Mid-level' },
  { value: 'Senior', label: 'Senior' },
];

const FormSchema = z.object({
  topic: z.string({
    required_error: 'Please select a topic.',
  }),
  difficulty: z.string({
    required_error: 'Please select a difficulty level.',
  }),
});

export function StartInterviewForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const params = new URLSearchParams({
      topic: data.topic,
      difficulty: data.difficulty,
    });
    router.push(`/interview?${params.toString()}`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Topic</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a topic" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {topics.map((topic) => (
                    <SelectItem key={topic.value} value={topic.value}>{topic.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="difficulty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Difficulty Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a difficulty" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {difficulties.map((level) => (
                    <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" size="lg">
          <Rocket className="mr-2 h-5 w-5" />
          Start Interview
        </Button>
      </form>
    </Form>
  );
}
