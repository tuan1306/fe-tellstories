import { cookies } from "next/headers";
import { User, columns } from "./columns";
import { DataTable } from "./data-table";
import { Suspense } from "react";

// Remind my dumbass to return an array not a singer user.
// For the love of god, I have to remind myself so many about cookie doesn't automatically send everywhere.
export const getData = async (): Promise<User[]> => {
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
  const fullData: User[] = json.data;

  return fullData.map(({ id, email, displayName, userType, status }) => ({
    id,
    email,
    displayName,
    userType,
    status,
  }));
};

export default async function UserManagement() {
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
