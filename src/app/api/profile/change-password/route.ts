import { Pengguna } from "@/db/models/pengguna";
import { cookies } from "next/headers";
import { decode } from "jsonwebtoken";

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const decoded: any = decode(token);
    const username = decoded?.data?.username;

    if (!username) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return new Response(JSON.stringify({ error: "Current password and new password are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const penggunaModel = new Pengguna();
    const user = await penggunaModel.findByUsername(username);

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }    // Verify current password using the existing comparePassword method
    const isCurrentPasswordValid = await penggunaModel.comparePassword(username, currentPassword);
    if (!isCurrentPasswordValid) {
      return new Response(JSON.stringify({ error: "Current password is incorrect" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Update password using direct SQL update
    try {
      await penggunaModel.customQuery(
        "UPDATE PENGGUNA SET password = $1 WHERE username = $2",
        [newPassword, username]
      );
    } catch (error) {
      console.error("Error changing password:", error);
      return new Response(JSON.stringify({ error: "Failed to update password" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ message: "Password changed successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("PUT /api/profile/change-password error:", error);
    return new Response(JSON.stringify({ error: "Failed to change password" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
