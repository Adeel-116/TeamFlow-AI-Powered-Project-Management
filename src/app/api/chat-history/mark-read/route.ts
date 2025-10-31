// File: app/api/chat-history/mark-read/route.ts

import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function PATCH(request: Request) {
  try {
    console.log("📥 Mark read request received");
    
    const body = await request.json();
    console.log("📦 Request body:", body);
    
    const { senderId, receiverId } = body;

    if (!senderId || !receiverId) {
      console.error("❌ Missing parameters:", { senderId, receiverId });
      return NextResponse.json(
        { error: "senderId and receiverId are required" },
        { status: 400 }
      );
    }

    console.log(`🔄 Updating messages from ${senderId} to ${receiverId}`);

    // First check if there are any messages to update
    const checkResult = await pool.query(
      `SELECT COUNT(*) as count FROM messages 
       WHERE sender_id = $1 AND receiver_id = $2 AND is_read = FALSE`,
      [senderId, receiverId]
    );
    
    console.log(`📊 Found ${checkResult.rows[0].count} unread messages`);

    const result = await pool.query(
      `UPDATE messages
       SET is_read = TRUE, read_at = NOW()
       WHERE sender_id = $1 AND receiver_id = $2 AND is_read = FALSE
       RETURNING conversation_id`,
      [senderId, receiverId]
    );

    console.log(`✅ Updated ${result.rowCount} messages`);

    return NextResponse.json(
      { 
        success: true,
        message: "✅ Messages marked as read successfully",
        updatedCount: result.rowCount 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Error updating message read status:");
    console.error("Error name:", error?.name);
    console.error("Error message:", error?.message);
    console.error("Error stack:", error?.stack);
    
    return NextResponse.json(
      { 
        error: "Failed to update message read status",
        details: error?.message || "Unknown error"
      },
      { status: 500 }
    );
  }
}