import { cookies } from "next/headers";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Suspense } from "react";
import { UserDetails } from "@/app/types/user";
import { Loader2 } from "lucide-react";

// Remind my dumbass to return an array not a single user.
const getData = async (): Promise<UserDetails[]> => {
  const cookie = await cookies();
  const cookieToken = cookie.toString();

  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/users`, {
    cache: "no-cache",
    headers: {
      Cookie: cookieToken,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch users");

  const json = await res.json();
  const fullData: UserDetails[] = json.data;

  return fullData;
};

export default async function UserManagementPage() {
  const data = await getData();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
      <div className="col-span-4">
        <Suspense
          fallback={
            <div className="w-full h-64 flex items-center justify-center">
              <Loader2 className="animate-spin w-12 h-12 text-muted-foreground" />
            </div>
          }
        >
          <DataTable columns={columns} data={data} />
        </Suspense>
      </div>
    </div>
  );
}
