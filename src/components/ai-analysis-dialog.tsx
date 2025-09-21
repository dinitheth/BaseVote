'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { analyzeSentiment, type AnalyzeSentimentOutput } from '@/ai/flows/ai-sentiment-analysis-for-proposals';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { Button } from './ui/button';

type AIAnalysisDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  proposalTitle: string;
  proposalDescription: string;
};

export function AIAnalysisDialog({ isOpen, setIsOpen, proposalTitle, proposalDescription }: AIAnalysisDialogProps) {
  const [analysis, setAnalysis] = useState<AnalyzeSentimentOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const getAnalysis = async () => {
        setLoading(true);
        setError(null);
        setAnalysis(null);
        try {
          const result = await analyzeSentiment({ proposalDescription });
          setAnalysis(result);
        } catch (e) {
          setError('Failed to get AI analysis. Please try again later.');
          console.error(e);
        } finally {
          setLoading(false);
        }
      };
      getAnalysis();
    }
  }, [isOpen, proposalDescription]);

  const getSentimentBadgeVariant = (sentiment?: string) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return 'default';
      case 'negative':
        return 'destructive';
      default:
        return 'secondary';
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">AI Sentiment Analysis</DialogTitle>
          <DialogDescription>For proposal: "{proposalTitle}"</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {loading && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-6 w-1/2" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-6 w-3/4" />
              </div>
            </div>
          )}
          {error && <p className="text-destructive">{error}</p>}
          {analysis && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Overall Sentiment</h4>
                <Badge variant={getSentimentBadgeVariant(analysis.sentiment)} className="capitalize">{analysis.sentiment}</Badge>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Likelihood Analysis</h4>
                <p className="text-sm">{analysis.likelihood}</p>
              </div>
            </div>
          )}
           <Alert className="mt-4">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Disclaimer</AlertTitle>
              <AlertDescription>
                This AI analysis is for informational purposes only and is not financial or voting advice.
              </AlertDescription>
            </Alert>
        </div>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
