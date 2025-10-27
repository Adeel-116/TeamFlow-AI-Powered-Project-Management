import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET_KEY!);
    const currentUserId = decodedToken.uuid_id;

    const { recipientId } = await request.json();

    const [firstId, secondId] = currentUserId < recipientId
      ? [currentUserId, recipientId]
      : [recipientId, currentUserId];

    // Check existing conversation
    let result = await pool.query(
      `SELECT id FROM conversations WHERE user1_id = $1 AND user2_id = $2`,
      [firstId, secondId]
    );

    if (result.rows.length > 0) {
      return NextResponse.json({
        conversationId: result.rows[0].id
      });
    }

    // Create new conversation
    result = await pool.query(
      `INSERT INTO conversations (user1_id, user2_id)
       VALUES ($1, $2)
       ON CONFLICT (user1_id, user2_id) DO NOTHING
       RETURNING id`,
      [firstId, secondId]
    );

    return NextResponse.json({
      conversationId: result.rows[0].id
    });

  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
