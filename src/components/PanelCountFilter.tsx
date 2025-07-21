import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export function PanelCountFilter({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (panelType: string) => void;
}) {
  const panelOptions = ["Single", "Multiple"];

  return (
    <Collapsible defaultOpen={false} className="group/collapsible space-y-2">
      <CollapsibleTrigger className="flex items-center w-full cursor-pointer">
        <span className="text-sm font-medium">Panel Count</span>
        <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 pl-2">
        {panelOptions.map((type) => (
          <div key={type} className="flex items-center space-x-2">
            <Checkbox
              id={`panel-${type}`}
              checked={selected.includes(type)}
              onCheckedChange={() => onChange(type)}
            />
            <Label htmlFor={`panel-${type}`} className="text-sm">
              {type === "Single" ? "Single Panel" : "Multiple Panels"}
            </Label>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
