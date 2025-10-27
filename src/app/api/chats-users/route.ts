import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    // 1. Get token from cookies
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET_KEY!);
    const userId = decoded.uuid_id;
    const userEmail = decoded.email;

    const query = `
      SELECT uuid_id, name, email, role 
      FROM team_members 
      WHERE uuid_id != $1 AND email != $2
    `;
    const values = [userId, userEmail];

    const result = await pool.query(query, values);

    return NextResponse.json({ users: result.rows });
  } catch (error: any) {
    console.error("Error fetching chat users:", error);
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }
}
