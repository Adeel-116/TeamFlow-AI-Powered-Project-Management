import { NextResponse } from "next/server";
import { pool } from "@/lib/db";


export async function GET(
  request: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const { conversationId } = await params;

  try {
    const result = await pool.query(
      `SELECT * FROM messages 
       WHERE conversation_id = $1 
       ORDER BY created_at ASC`,
      [conversationId]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching chat history:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


export async function PATCH(request: Request) {
  try {
    const { senderId, receiverId } = await request.json();

    if (!senderId || !receiverId) {
      return NextResponse.json(
        { error: "senderId and receiverId are required" },
        { status: 400 }
      );
    }

    await pool.query(
      `UPDATE messages
       SET is_read = TRUE, read_at = NOW()
       WHERE sender_id = $1 AND receiver_id = $2 AND is_read = FALSE`,
      [senderId, receiverId]
    );

    return NextResponse.json(
      { message: "✅ Messages marked as read successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error updating message read status:", error);
    return NextResponse.json(
      { error: "Failed to update message read status" },
      { status: 500 }
    );
  }
}