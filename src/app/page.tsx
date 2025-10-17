import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Header } from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StartInterviewForm } from '@/components/start-interview-form';

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-interview');

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_550px] lg:gap-12 xl:grid-cols-[1fr_650px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-primary">
                    Ace Your Next Front-End Interview
                  </h1>
                  <p className="max-w-[600px] text-foreground/80 md:text-xl">
                    Our AI-powered mentor asks the questions, evaluates your answers, and gives you personalized feedback to land your dream job.
                  </p>
                </div>
                <Card className="max-w-lg shadow-lg">
                  <CardHeader>
                    <CardTitle className="font-headline">Start Your Practice Session</CardTitle>
                    <CardDescription>Select your desired topic and difficulty to begin.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <StartInterviewForm />
                  </CardContent>
                </Card>
              </div>
              <div className="relative overflow-hidden rounded-xl shadow-2xl h-[400px] lg:h-[500px]">
                {heroImage && (
                  <Image
                    alt={heroImage.description}
                    className="object-cover"
                    src={heroImage.imageUrl}
                    data-ai-hint={heroImage.imageHint}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex items-center justify-center py-6 border-t">
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Front-End Interview Ace</p>
      </footer>
    </>
  );
}
