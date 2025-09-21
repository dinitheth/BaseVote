'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { ethers } from 'ethers';
import { contractAddress, contractABI } from '@/lib/contract';

const TITLE_MAX_LENGTH = 100;
const DESC_MAX_LENGTH = 300;

const formSchema = z.object({
  title: z.string().min(10, {
    message: 'Title must be at least 10 characters.',
  }).max(TITLE_MAX_LENGTH, {
    message: `Title must not be longer than ${TITLE_MAX_LENGTH} characters.`,
  }),
  description: z.string().min(20, {
    message: 'Description must be at least 20 characters.',
  }).max(DESC_MAX_LENGTH, {
    message: `Description must not be longer than ${DESC_MAX_LENGTH} characters.`,
  }),
});

export function CreateProposalForm() {
    const { toast } = useToast();
    const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
    },
     mode: "onChange",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: "Submitting Proposal...",
      description: "Please confirm the transaction in your wallet.",
    });

    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('Please install a web3 wallet like MetaMask.');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.createProposal(values.title, values.description);
      
      // Wait for the transaction to be mined
      await tx.wait();

      toast({
        title: "Proposal Submitted Successfully!",
        description: "Your proposal has been recorded on the blockchain.",
      });
      
      form.reset();

      // Redirect to the main page after a short delay
      setTimeout(() => {
          router.push('/main');
      }, 2000);

    } catch (error: any) {
      console.error('Proposal submission failed:', error);
      let errorMessage = "An unknown error occurred.";

      if (error.code === 'ACTION_REJECTED') {
        errorMessage = "Transaction rejected in wallet.";
      } else if (error.code === 'INSUFFICIENT_FUNDS') {
        errorMessage = "Insufficient funds for gas. Please add funds to your wallet.";
      } else {
        errorMessage = error.reason || "An error occurred. See console for details.";
      }
      
      toast({
        title: "Submission Failed",
        description: `Could not submit proposal: ${errorMessage}`,
        variant: "destructive",
      });
    }
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle className="font-headline text-lg">Proposal Details</CardTitle>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Proposal Title</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Should Base launch a token?" {...field} />
                    </FormControl>
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                      <FormDescription className="flex-1">
                          Your proposal must be a Yes/No question.
                      </FormDescription>
                       <div className="text-sm text-muted-foreground flex items-center leading-tight">
                        <span>{field.value.length}/{TITLE_MAX_LENGTH}</span>
                      </div>
                    </div>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Proposal Description</FormLabel>
                    <FormControl>
                        <Textarea
                        placeholder="Describe your proposal..."
                        className="resize-none"
                        {...field}
                        rows={6}
                        />
                    </FormControl>
                     <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                        <FormDescription className="flex-1">
                            Add short context to help members decide Yes or No.
                        </FormDescription>
                        <div className="text-sm text-muted-foreground flex items-center leading-tight">
                            <span>{field.value.length}/{DESC_MAX_LENGTH}</span>
                        </div>
                    </div>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit" className="w-full font-bold" disabled={!form.formState.isValid || form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Submitting..." : "Submit Proposal"}
                </Button>
            </form>
            </Form>
        </CardContent>
    </Card>
  );
}
