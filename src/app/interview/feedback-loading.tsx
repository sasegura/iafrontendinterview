import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BrainCircuit } from 'lucide-react';

export default function FeedbackLoading() {
  return (
    <div className="animate-in fade-in-0 zoom-in-95">
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
            <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-7 w-40" />
            </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-12 w-full" />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
                 <div className="space-y-2 rounded-lg border p-4">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                </div>
                 <div className="space-y-2 rounded-lg border p-4">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                </div>
            </div>

            <div className="flex justify-between items-center bg-muted p-4 rounded-lg">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-5 w-48" />
                </div>
                <Skeleton className="h-8 w-20 rounded-full" />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <Skeleton className="h-10 w-full sm:w-36" />
                <Skeleton className="h-10 w-full sm:w-36" />
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
