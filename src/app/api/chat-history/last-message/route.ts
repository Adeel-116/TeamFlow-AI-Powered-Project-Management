import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(
  request: NextRequest, 
){

  try {
    const query = `
      SELECT 
        m.sender_id AS senderid,
        COUNT(*) AS count
      FROM messages m
      WHERE m.receiver_id = $1 
        AND m.is_read = false
      GROUP BY m.sender_id
    `;

    const result = await pool.query(query, [userId]);

    const unreadCounts: Record<string, { userId: string; count: number }> = {};
    result.rows.forEach((row: any) => {
      unreadCounts[row.senderid] = {
        userId: row.senderid,
        count: Number(row.count),
      };
    });

    return NextResponse.json({ unreadCounts });
  } catch (error) {
    console.error("Error fetching unread messages:", error);
    return NextResponse.json({ error: "Failed to fetch unread messages" }, { status: 500 });
  }
}
