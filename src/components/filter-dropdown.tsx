import { Filter } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const filterOptions = ["all", "running", "upcoming", "closed"];

export const FilterDropdown = ({
  currentState,
  onFilter,
}: {
  currentState: string;
  onFilter: (state: string) => void;
}) => {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"outline"} className="outline-none">
            <Filter /> <span className="ml-2 capitalize">{currentState}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          {filterOptions.map((option) => (
            <DropdownMenuItem
              key={option}
              className={`cursor-pointer focus:bg-gray-200 ${
                currentState === option && "bg-gray-200"
              }`}
              onClick={() => onFilter(option)}
            >
              <span className="capitalize">{option}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
