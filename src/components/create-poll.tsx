"use client";

import { createPollWithCandidates } from "@/actions/blockchain.actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Program } from "@coral-xyz/anchor";
import { Polly } from "@project/anchor";
import { PublicKey } from "@solana/web3.js";
import { PlusCircle, X } from "lucide-react";
import { useState } from "react";
import CalendarPopover from "./calendar-popover/calendar-popover";
import { useAnchorProvider } from "./solana/solana-provider";
import { Spinner } from "./spinner";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function CreatePollDialog({
  program,
  publicKey,
}: {
  program: Program<Polly>;
  publicKey: PublicKey;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const { connection, wallet } = useAnchorProvider();
  const { toast } = useToast()

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const currentDate = new Date();
    if (startDate && startDate < currentDate || endDate && endDate < currentDate) {
      toast({
        className: cn(
          'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4'
        ),
        title: "What you doing ser?",
        description: "Start date or/and end date cannot be in the past",
        variant:"destructive",
      });
      setIsLoading(false);
      return;
    }
    try {
      await createPollWithCandidates({
        program,
        publicKey,
        startDate: startDate?.getTime()! / 1000,
        endDate: endDate?.getTime()! / 1000,
        title,
        options,
        connection,
        wallet,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsOpen(false);
      setTitle("");
      setStartDate(undefined);
      setEndDate(undefined);
      setOptions(["", ""]);
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size={"lg"} className="transition-colors duration-300">
          Create Poll
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Create New Poll</DialogTitle>
          <DialogDescription>Approx cost: xxx SOL</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="start-date" className="text-right">
                Start Date
              </Label>
              <CalendarPopover date={startDate} setDate={setStartDate} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date" className="text-right">
                End Date
              </Label>
              <CalendarPopover date={endDate} setDate={setEndDate} />
            </div>
            <div className="space-y-2 w-full">
              <div className="grid items-center gap-4 w-full">
                <div className="space-y-2 w-full">
                  <Label className="text-right">Options</Label>
                  <div className="grid grid-cols-2 w-full gap-2">
                    {options.map((option, index) => (
                      <div
                        key={index}
                        className="flex w-full items-center gap-2"
                      >
                        <Input
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(index, e.target.value)
                          }
                          placeholder={`Option ${index + 1}`}
                          required
                        />
                        {index >= 2 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveOption(index)}
                            className="flex-shrink-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    className="mt-2"
                    onClick={handleAddOption}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Option
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="w-full transition-colors duration-300"
            >
              {isLoading ? <Spinner /> : "Push to Blockchain"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
