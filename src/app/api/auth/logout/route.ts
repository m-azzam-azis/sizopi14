import { cookies } from "next/headers";

export async function POST(req: Request) {
  const cookieStore = await cookies();

  cookieStore.delete("token");

  return new Response(
    JSON.stringify({
      message: "Success",
      data: "Logged out successfully",
    }),
    { status: 200 }
  );
}
