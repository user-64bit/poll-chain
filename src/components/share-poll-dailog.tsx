"use client";

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
import { PollOptionProps } from "@/utils/types";
import { Check, Copy, Linkedin, Share2 } from "lucide-react";
import { useState } from "react";

export default function SharePollDialog({
  pollAdress,
  candidates,
  trigger,
}: {
  pollAdress: string;
  candidates: PollOptionProps[];
  trigger?: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://pollchain.arthprajapati.com";
  const pollURL = `${origin}/poll/${pollAdress}`;
  const shareText = `Vote on-chain: ${candidates
    .map((c) => c.name)
    .slice(0, 4)
    .join(" vs ")}. One wallet, one vote — recorded forever.`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(pollURL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const shareToSocial = (platform: "twitter" | "linkedin") => {
    let shareUrl = "";
    if (platform === "twitter") {
      shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        shareText
      )}&url=${encodeURIComponent(pollURL)}`;
    } else {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        pollURL
      )}`;
    }
    window.open(shareUrl, "_blank", "width=600,height=480,noopener,noreferrer");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button variant="outline" className="w-full gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Share this poll</DialogTitle>
          <DialogDescription>
            Anyone with the link can view results and vote with their wallet.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="relative flex items-center">
            <Input
              value={pollURL}
              readOnly
              className="pr-12 font-mono text-sm"
              aria-label="Poll link"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={copyToClipboard}
              className="absolute right-1"
              aria-label="Copy link"
            >
              {copied ? (
                <Check className="h-4 w-4 text-live" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={() => shareToSocial("twitter")}
            >
              <XLogo className="h-4 w-4" />
              Post
            </Button>
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={() => shareToSocial("linkedin")}
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function XLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
