import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useState } from "react";

export default function CalendarPopover({
  date,
  setDate,
}: {
  date: Date | undefined;
  setDate: (date?: Date) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={
            "w-full justify-start text-left font-normal bg-transparent"
          }
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => {
            setDate(date);
            setIsOpen(false);
          }}
          className="border-0 rounded-xl"
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
