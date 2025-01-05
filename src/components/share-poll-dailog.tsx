"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PollOptionProps } from "@/utils/types";
import { Check, Copy, Linkedin, Share2, Twitter } from "lucide-react";
import { useState } from "react";

export default function SharePollDialog({
  pollAdress,
  candidates,
  trigger,
}: {
  pollAdress: string;
  candidates: PollOptionProps[];
  trigger?: any;
}) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const pollURL = "https://pollchain.arthprajapati.com/" + pollAdress;
  const postText =
    `Look what I found here. an incredible poll between ${candidates
      .map((c) => c.name)
      .join(", ")}. Vote now! \n\n ` + pollURL;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(pollURL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {}
  };
  const shareToSocial = (platform: string) => {
    let shareUrl = "";

    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?pollURL=${encodeURIComponent(
          pollURL
        )}&text=${encodeURIComponent(postText)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
          pollURL
        )}&title=${encodeURIComponent(
          "Check out this poll"
        )}&summary=${encodeURIComponent(postText)}&source=${encodeURIComponent(
          "Poll Chain"
        )}`;
        break;
    }

    window.open(shareUrl, "_blank", "width=600,height=400");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button
            variant={"outline"}
            className="w-full rounded-full transition-colors duration-300"
          >
            <Share2 className="h-4 w-4" />
            Share Poll
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Share this Poll</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-2">
            <Input value={pollURL} readOnly className="font-mono text-sm" />
            <Button
              variant="outline"
              size="icon"
              onClick={copyToClipboard}
              className="shrink-0"
              aria-label="Copy URL to clipboard"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="flex justify-between gap-x-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => shareToSocial("twitter")}
            >
              <Twitter className="mr-2 h-4 w-4" />
              Twitter
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => shareToSocial("linkedin")}
            >
              <Linkedin className="mr-2 h-4 w-4" />
              LinkedIn
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
