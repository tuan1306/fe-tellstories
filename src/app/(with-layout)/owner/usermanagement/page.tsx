import { User, columns } from "./columns";
import { DataTable } from "./data-table";

// Remind my dumbass to return an array not a singer user.
export const getData = async (): Promise<User[]> => {
  return [
    {
      id: "1",
      displayName: "NguyenLe",
      email: "nguyenle@gmai.com",
      userType: null,
      status: "Active",
    },
    {
      id: "2",
      displayName: "JaneDoe",
      email: "janedoe@gmail.com",
      userType: "Admin",
      status: "Pending",
    },
  ];
};

export default async function UserManagement() {
  const data = await getData();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
      <div className="col-span-4">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
