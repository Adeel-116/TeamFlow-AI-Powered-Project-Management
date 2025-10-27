import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(
  request: Request,
  { params }: { params: { conversationId: string } }
) {
  try {
    // Get token from cookies
    const cookieHeader = request.headers.get('cookie');
    const token = cookieHeader?.split('token=')[1]?.split(';')[0];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Decode JWT
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET_KEY!);
    const userId = decoded.uuid_id; // adjust to your token structure
    const { conversationId } = params;

    // Verify user is part of conversation
    const convCheck = await pool.query(
      `SELECT * FROM conversations 
       WHERE id = $1 
       AND (user1_id = $2 OR user2_id = $2)`,
      [conversationId, userId]
    );

    if (convCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get messages
    const result = await pool.query(
      `SELECT 
        id,
        conversation_id as "conversationId",
        sender_id as "senderId",
        content,
        is_read as "isRead",
        created_at as timestamp
       FROM messages 
       WHERE conversation_id = $1 
       ORDER BY created_at ASC`,
      [conversationId]
    );

    return NextResponse.json({ messages: result.rows });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
