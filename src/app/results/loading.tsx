import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ResultsLoading() {
  return (
    <div className="container mx-auto max-w-5xl py-12 px-4 md:px-6">
      <div className="space-y-4 text-center">
        <Skeleton className="h-12 w-3/4 mx-auto" />
        <Skeleton className="h-6 w-1/2 mx-auto" />
      </div>
      <div className="mt-12 grid gap-8 md:grid-cols-3">
        <Card><CardHeader><Skeleton className="h-6 w-24" /></CardHeader><CardContent><Skeleton className="h-10 w-16" /></CardContent></Card>
        <Card><CardHeader><Skeleton className="h-6 w-32" /></CardHeader><CardContent><Skeleton className="h-10 w-20" /></CardContent></Card>
        <Card><CardHeader><Skeleton className="h-6 w-28" /></CardHeader><CardContent><Skeleton className="h-10 w-24" /></CardContent></Card>
      </div>
      <div className="mt-12 space-y-8">
        <Skeleton className="h-10 w-64" />
        <Card>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
      <div className="mt-12 space-y-8">
        <Skeleton className="h-10 w-48" />
        <Card><CardContent className="p-6"><Skeleton className="h-32 w-full" /></CardContent></Card>
      </div>
    </div>
  );
}
