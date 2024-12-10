import { Filter } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export const FilterDropdown = ({
  onFilter,
}: {
  onFilter: (state: string) => void;
}) => {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"outline"} className="outline-none">
            <Filter />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => onFilter("all")}
          >
            <span>All</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => onFilter("running")}
          >
            <span>Running</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => onFilter("upcoming")}
          >
            <span>Upcoming</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => onFilter("closed")}
          >
            <span>Closed</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
