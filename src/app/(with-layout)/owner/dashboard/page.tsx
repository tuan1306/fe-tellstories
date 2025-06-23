import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Eye,
  Library,
  TrendingDown,
  TrendingUp,
  User,
  UserPlus,
} from "lucide-react";

export default function Dashboard() {
  return (
    // If screen s=1col l=2cols prettybig=4cols
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
      <div className="text-4xl col-span-4 font-semibold mt-4 ml-3">
        Welcome back, John.
      </div>
      <Card className="text-4xl col-span-1 text-[16px] gap-4">
        <CardHeader>
          <CardTitle className="flex gap-2 text-[16px]">
            <UserPlus />
            New Account
          </CardTitle>
          <CardDescription>Accounts created this week</CardDescription>
          <CardAction>
            <Badge variant="outline" className="text-green-400">
              <TrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="text-4xl">
          <p>1,394</p>
        </CardContent>
      </Card>
      <Card className="text-4xl col-span-1 text-[16px] gap-4">
        <CardHeader>
          <CardTitle className="flex gap-2 text-[16px]">
            <User />
            Active Account
          </CardTitle>
          <CardDescription>Accounts currently active</CardDescription>
          <CardAction>
            <Badge variant="outline" className="text-red-400">
              <TrendingDown />
              -12%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="text-4xl">
          <p>1,394</p>
        </CardContent>
      </Card>
      <Card className="text-4xl col-span-1 text-[16px] gap-4">
        <CardHeader>
          <CardTitle className="flex gap-2 text-[16px]">
            <Library />
            Published Stories
          </CardTitle>
          <CardDescription>Published stories this week</CardDescription>
          <CardAction>
            <Badge variant="outline" className="text-green-400">
              <TrendingUp />
              +20.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="text-4xl">
          <p>2,934</p>
        </CardContent>
      </Card>
      <Card className="text-4xl col-span-1 text-[16px] gap-4">
        <CardHeader>
          <CardTitle className="flex gap-2 text-[16px]">
            <Eye />
            Stories views
          </CardTitle>
          <CardDescription>Total story views</CardDescription>
          <CardAction>
            <Badge variant="outline" className="text-green-400">
              <TrendingUp />
              +17.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="text-4xl">
          <p>727,420</p>
        </CardContent>
      </Card>
      <div className="bg-primary-foreground p-4 rounded-2xl lg:col-span-4">
        Amongus
      </div>
      <div className="bg-primary-foreground p-4 rounded-2xl lg:col-span-4">
        Amongus
      </div>
    </div>
  );
}
