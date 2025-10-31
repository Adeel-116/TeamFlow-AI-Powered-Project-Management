// app/api/messages/route.ts
import { NextResponse } from 'next/server';
import { pool } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const senderId = searchParams.get('senderId');
    const receiverId = searchParams.get('receiverId');

    if (!senderId || !receiverId) {
      return NextResponse.json({ error: "Missing user IDs" }, { status: 400 });
    }

    const result = await pool.query(
      `SELECT 
        sender_id as "senderId",
        receiver_id as "receiverId",
        content as message,
        created_at as timestamp
       FROM messages 
       WHERE (sender_id = $1 AND receiver_id = $2) 
          OR (sender_id = $2 AND receiver_id = $1)
       ORDER BY created_at ASC`,
      [senderId, receiverId]
    );

    return NextResponse.json({
      messages: result.rows
    });

  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { conversationId, message } = data;
    console.log(conversationId, message)
    
    if (!message.senderId || !message.receiverId) {
      return NextResponse.json({ error: "Missing user IDs" }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO messages (conversation_id, sender_id, receiver_id, content, is_read, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING id, created_at`,
      [
        conversationId, 
        message.senderId,
        message.receiverId,
        message.message,
        false
      ]
    );

    console.log("Inserted message ID:", result.rows[0].id);

    return NextResponse.json({
      ok: true,
      message: "Insertion Successfully",
      messageId: result.rows[0].id,
      timestamp: result.rows[0].created_at
    });

  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}