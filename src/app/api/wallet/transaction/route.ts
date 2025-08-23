import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = (await cookies()).get("authToken")?.value;

    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") ?? "1";
    const pageSize = searchParams.get("pageSize") ?? "10";
    const userId = searchParams.get("userId") ?? "";
    const type = searchParams.get("type") ?? "";
    const from = searchParams.get("from") ?? "";
    const to = searchParams.get("to") ?? "";

    const query = new URLSearchParams({
      page,
      pageSize,
    });

    if (userId) query.append("userId", userId);
    if (type) query.append("type", type);
    if (from) query.append("from", from);
    if (to) query.append("to", to);

    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_BASE_URL
      }/WalletTransactions?${query.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const log = await res.text();
      return NextResponse.json(
        { message: "Failed to fetch wallet transactions", error: log },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("GET - /api/wallet-transactions response:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
