// components/AudioFilter.tsx
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export function TTSAudioFilter({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (option: string) => void;
}) {
  const options = ["TTS", "Without TTS"];

  return (
    <Collapsible defaultOpen={false} className="group/collapsible space-y-2">
      <CollapsibleTrigger className="flex items-center w-full cursor-pointer">
        <span className="text-sm font-medium">Audio</span>
        <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 pl-2">
        {options.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <Checkbox
              id={`audio-${option}`}
              checked={selected.includes(option)}
              onCheckedChange={() => onChange(option)}
            />
            <Label htmlFor={`audio-${option}`} className="text-sm">
              {option}
            </Label>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
