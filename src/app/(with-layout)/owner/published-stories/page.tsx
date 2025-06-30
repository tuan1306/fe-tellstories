import { cookies } from "next/headers";
import DataTable from "./data-table";
import { StoryDetails } from "@/app/types/story";

export const getData = async (): Promise<StoryDetails[]> => {
  const cookie = await cookies();
  const cookieToken = cookie.toString();

  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/stories`, {
    cache: "no-cache",
    headers: {
      Cookie: cookieToken,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch users");

  const json = await res.json();
  const fullData: StoryDetails[] = json.data;

  return fullData;
};

export default async function Page() {
  const stories = await getData();
  return <DataTable stories={stories} />;
}
