import { cookies } from "next/headers";

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  return new Response(
    JSON.stringify({
      message: "Success",
      token: token?.value,
    }),
    { status: 200 }
  );
}
