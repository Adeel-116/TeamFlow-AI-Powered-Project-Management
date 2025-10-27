import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie');
    const token = cookieHeader?.split('token=')[1]?.split(';')[0];
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Decode token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET_KEY!);
    const userId = decoded.uuid_id;

    const { conversationId, content, recipientId } = await request.json();

    let actualConversationId = conversationId;

    // If no conversation exists, create one
    if (!conversationId && recipientId) {
      let convResult = await pool.query(
        `SELECT id FROM conversations 
         WHERE (user1_id = $1 AND user2_id = $2)
            OR (user1_id = $2 AND user2_id = $1)`,
        [userId, recipientId]
      );

      if (convResult.rows.length === 0) {
        convResult = await pool.query(
          `INSERT INTO conversations (user1_id, user2_id)
           VALUES ($1, $2)
           RETURNING id`,
          [userId, recipientId]
        );
      }

      actualConversationId = convResult.rows[0].id;
    }

    // Verify user is part of conversation
    const convCheck = await pool.query(
      `SELECT * FROM conversations 
       WHERE id = $1 
       AND (user1_id = $2 OR user2_id = $2)`,
      [actualConversationId, userId]
    );

    if (convCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Insert message
    const result = await pool.query(
      `INSERT INTO messages (conversation_id, sender_id, content)
       VALUES ($1, $2, $3)
       RETURNING id, conversation_id as "conversationId", 
                 sender_id as "senderId", content, is_read as "isRead", 
                 created_at as timestamp`,
      [actualConversationId, userId, content]
    );

    // Update conversation timestamp
    await pool.query(
      'UPDATE conversations SET updated_at = NOW() WHERE id = $1',
      [actualConversationId]
    );

    return NextResponse.json({ 
      message: result.rows[0],
      conversationId: actualConversationId 
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
