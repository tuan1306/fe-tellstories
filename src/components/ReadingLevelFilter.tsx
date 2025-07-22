import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export function ReadingLevelFilter({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (level: string) => void;
}) {
  const levels = ["Sơ cấp", "Trung cấp", "Nâng cao"];

  return (
    <Collapsible defaultOpen={false} className="group/collapsible space-y-2">
      <CollapsibleTrigger className="flex items-center w-full cursor-pointer">
        <span className="text-sm font-medium">Reading level</span>
        <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 pl-2">
        {levels.map((level) => (
          <div key={level} className="flex items-center space-x-2">
            <Checkbox
              id={`level-${level}`}
              checked={selected.includes(level)}
              onCheckedChange={() => onChange(level)}
            />
            <Label htmlFor={`level-${level}`} className="text-sm">
              {level}
            </Label>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
