import { cookies } from "next/headers";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Suspense } from "react";
import { UserDetails } from "@/app/types/user";

// Remind my dumbass to return an array not a singer user.
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
        <Suspense fallback={<div>Loading user table...</div>}>
          <DataTable columns={columns} data={data} />
        </Suspense>
      </div>
    </div>
  );
}
