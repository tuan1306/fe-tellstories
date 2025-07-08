import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export function AgeGroupFilter({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (age: string) => void;
}) {
  const ageRanges = ["1-3", "3-5", "5-8", "8-10", "10+"];

  return (
    <Collapsible defaultOpen={false} className="group/collapsible space-y-2">
      <Label
        htmlFor="filter"
        className="text-[12px] text-muted-foreground font-semibold"
      >
        Filter
      </Label>
      <CollapsibleTrigger className="flex items-center w-full cursor-pointer">
        <span className="text-sm font-medium">Age Group</span>
        <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 pl-2">
        {ageRanges.map((range) => (
          <div key={range} className="flex items-center space-x-2">
            <Checkbox
              id={`age-${range}`}
              checked={selected.includes(range)}
              onCheckedChange={() => onChange(range)}
            />
            <Label htmlFor={`age-${range}`} className="text-sm">
              {range}
            </Label>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
