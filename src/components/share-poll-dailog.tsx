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
import { motion, AnimatePresence } from "framer-motion";

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
            className="w-full rounded-full transition-all duration-300 border-border/60 hover:border-border hover:bg-secondary/80 hover:shadow-sm"
          >
            <motion.div 
              className="flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </motion.div>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md overflow-hidden bg-card/90 backdrop-blur-sm border-border/40">
        <DialogHeader>
          <DialogTitle className="text-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="inline-block"
            >
              <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent font-bold">
                Share this Poll
              </span>
            </motion.div>
          </DialogTitle>
        </DialogHeader>
        
        <motion.div 
          className="space-y-5 py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <motion.div 
            className="flex items-center space-x-2 relative"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Input 
              value={pollURL} 
              readOnly 
              className="font-mono text-sm pr-10 transition-all border-border/50 focus:border-primary/50 bg-background/50" 
            />
            <Button
              variant="outline"
              size="icon"
              onClick={copyToClipboard}
              className="absolute right-1 border-0 bg-transparent hover:bg-secondary/80"
              aria-label="Copy URL to clipboard"
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Check className="h-4 w-4 text-green-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Copy className="h-4 w-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>

          <motion.div 
            className="flex justify-between gap-x-3"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Button
              variant="outline"
              className="w-full bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] hover:text-[#1DA1F2] border-[#1DA1F2]/20 hover:border-[#1DA1F2]/30 transition-all duration-300"
              onClick={() => shareToSocial("twitter")}
            >
              <motion.div 
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Twitter className="mr-2 h-4 w-4" />
                Twitter
              </motion.div>
            </Button>
            <Button
              variant="outline"
              className="w-full bg-[#0077B5]/10 hover:bg-[#0077B5]/20 text-[#0077B5] hover:text-[#0077B5] border-[#0077B5]/20 hover:border-[#0077B5]/30 transition-all duration-300"
              onClick={() => shareToSocial("linkedin")}
            >
              <motion.div 
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Linkedin className="mr-2 h-4 w-4" />
                LinkedIn
              </motion.div>
            </Button>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
