import { Button } from "@/components/ui/button";

interface CreateAIStoryButton {
  prompt: string;
  isLoading: boolean;
  handleAIGenerate: () => Promise<void>;
}

export default function GenerateAIButton({
  prompt,
  isLoading,
  handleAIGenerate,
}: CreateAIStoryButton) {
  return (
    <Button disabled={!prompt || isLoading} onClick={handleAIGenerate}>
      {isLoading ? "Generating..." : "Generate with AI"}
    </Button>
  );
}
