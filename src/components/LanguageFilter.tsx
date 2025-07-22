import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export function LanguageFilter({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (lang: string) => void;
}) {
  const languages = ["ENG", "VIE"];

  return (
    <Collapsible defaultOpen={false} className="group/collapsible space-y-2">
      <CollapsibleTrigger className="flex items-center w-full cursor-pointer">
        <span className="text-sm font-medium">Language</span>
        <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 pl-2">
        {languages.map((lang) => (
          <div key={lang} className="flex items-center space-x-2">
            <Checkbox
              id={`lang-${lang}`}
              checked={selected.includes(lang)}
              onCheckedChange={() => onChange(lang)}
            />
            <Label htmlFor={`lang-${lang}`} className="text-sm">
              {lang}
            </Label>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
