import HelloWorld from "@/components/misc/HelloWorld";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen flex items-center justify-center flex-col gap-8">
      <HelloWorld />
      <Button className="bg-slate-500 blur-sm hover:blur-none cursor-pointer">
        <Link href="/login"> To the another side of the world!</Link>
      </Button>
    </div>
  );
}
