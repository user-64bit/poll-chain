"use client";

import { createPollWithCandidates } from "@/actions/blockchain.actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Program } from "@coral-xyz/anchor";
import { Polly } from "@project/anchor";
import { PublicKey } from "@solana/web3.js";
import { Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import CalendarPopover from "./calendar-popover/calendar-popover";
import { useAnchorProvider } from "./solana/solana-provider";
import { Spinner } from "./spinner";

export function CreatePollDialog({
  program,
  publicKey,
  onCreated,
}: {
  program: Program<Polly>;
  publicKey: PublicKey;
  onCreated?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const { connection, wallet } = useAnchorProvider();
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();

  const reset = () => {
    setTitle("");
    setStartDate(undefined);
    setEndDate(undefined);
    setOptions(["", ""]);
    setErrors({});
  };

  const handleAddOption = () => setOptions([...options, ""]);
  const handleRemoveOption = (index: number) =>
    setOptions(options.filter((_, i) => i !== index));
  const handleOptionChange = (index: number, value: string) => {
    const next = [...options];
    next[index] = value;
    setOptions(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (
      (startDate && startDate < yesterday) ||
      (endDate && endDate < yesterday)
    ) {
      toast({
        title: "Dates can't be in the past",
        description: "Pick a start and end date that are today or later.",
        variant: "destructive",
      });
      return;
    }
    if (startDate && endDate && endDate <= startDate) {
      toast({
        title: "End must be after start",
        description: "The voting window needs to close after it opens.",
        variant: "destructive",
      });
      return;
    }
    if (!wallet || !connection || !publicKey) {
      toast({
        title: "Connect your wallet",
        description: "You need a connected wallet to put a poll on-chain.",
        variant: "destructive",
      });
      return;
    }

    const nextErrors = {
      title: title.trim() === "",
      startDate: startDate === undefined,
      endDate: endDate === undefined,
      options: options.some((o) => o.trim() === ""),
    };
    if (Object.values(nextErrors).some(Boolean)) {
      setErrors(nextErrors);
      return;
    }

    setIsLoading(true);
    try {
      await createPollWithCandidates({
        program,
        publicKey,
        startDate: startDate!.getTime() / 1000,
        endDate: endDate!.getTime() / 1000,
        title: title.trim(),
        options: options.map((o) => o.trim()),
        connection,
        wallet,
      });
      toast({
        title: "Poll created on-chain",
        description: "Your poll is live and recorded on Solana devnet.",
      });
      setIsOpen(false);
      reset();
      onCreated?.();
    } catch (error) {
      console.error(error);
      toast({
        title: "Couldn't create the poll",
        description:
          "The transaction was rejected or failed. Check your wallet and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2">
          <Plus className="h-4 w-4" />
          Create poll
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Create a poll</DialogTitle>
          <DialogDescription>
            Your question and every vote are recorded on Solana devnet. Once
            it&apos;s live, it can&apos;t be edited or deleted.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-5 py-2">
            <div className="space-y-2">
              <Label htmlFor="title">Question</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={280}
                placeholder="e.g. Who's the GOAT — Sachin or Virat?"
              />
              {errors.title && (
                <p className="text-xs text-destructive">Add a question to ask.</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Opens</Label>
                <CalendarPopover date={startDate} setDate={setStartDate} />
                {errors.startDate && (
                  <p className="text-xs text-destructive">Pick a start date.</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Closes</Label>
                <CalendarPopover date={endDate} setDate={setEndDate} />
                {errors.endDate && (
                  <p className="text-xs text-destructive">Pick an end date.</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <Label>Options</Label>
                <span className="text-xs text-muted-foreground">
                  Max 32 characters each
                </span>
              </div>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="w-5 shrink-0 text-center font-mono text-xs text-muted-foreground">
                      {index + 1}
                    </span>
                    <Input
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      maxLength={32}
                      placeholder={`Option ${index + 1}`}
                    />
                    {index >= 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveOption(index)}
                        className="shrink-0 text-muted-foreground hover:text-destructive"
                        aria-label={`Remove option ${index + 1}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              {errors.options && (
                <p className="text-xs text-destructive">
                  Every option needs a label.
                </p>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-1 gap-2"
                onClick={handleAddOption}
              >
                <Plus className="h-4 w-4" />
                Add option
              </Button>
            </div>
          </div>

          <div className="mt-2 space-y-2">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Spinner size="sm" /> : "Create poll on-chain"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              You&apos;ll approve one transaction. Network fee only — a few
              fractions of a cent on devnet.
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
