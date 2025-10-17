import Link from 'next/link';
import { Bot } from 'lucide-react';

export function Header() {
  return (
    <header className="py-4 px-6 border-b bg-card">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-headline text-xl font-bold text-primary">
          <Bot className="h-7 w-7" />
          <span>Front-End Interview Ace</span>
        </Link>
      </div>
    </header>
  );
}
