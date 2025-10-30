import { NextResponse, } from 'next/server';
import { pool } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { conversationId, message } = data;
    console.log(conversationId, message)
    
    if (!message.senderId || !message.receiverId) {
      return NextResponse.json({ error: "Missing user IDs" }, { status: 400 });
    }

   const result = await pool.query(
  `INSERT INTO messages (conversation_id, sender_id, receiver_id, content, is_read, read_at)
   VALUES ($1, $2, $3, $4, $5, NOW())
   RETURNING id`,
  [
    conversationId, 
    message.senderId,
    message.receiverId,
    message.message,
    false
  ]
);

console.log("Inserted message ID:", result.rows[0].id);

    console.log("Inserted message ID:", result.rows[0].id);

    return NextResponse.json({
      status: 200, 
      message: "Insertion Successfully"
    });

  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
