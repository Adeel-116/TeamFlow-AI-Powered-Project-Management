// import { NextResponse } from 'next/server';
// import { pool } from '@/lib/db';
// import { cookies } from "next/headers";
// import jwt from "jsonwebtoken";

// export async function GET(
//   request: Request,
//   { params }: { params: { conversationId: string } }
// ) {
//   try {
//     // Get token from cookies
//     const cookieHeader = request.headers.get('cookie');
//     const token = cookieHeader?.split('token=')[1]?.split(';')[0];

//     if (!token) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     // Decode JWT
//     const decoded: any = jwt.verify(token, process.env.JWT_SECRET_KEY!);
//     const userId = decoded.uuid_id; // adjust to your token structure
//     const { conversationId } = params;

//     // Verify user is part of conversation
//     const convCheck = await pool.query(
//       `SELECT * FROM conversations 
//        WHERE id = $1 
//        AND (user1_id = $2 OR user2_id = $2)`,
//       [conversationId, userId]
//     );

//     if (convCheck.rows.length === 0) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
//     }

//     // Get messages
//     const result = await pool.query(
//       `SELECT 
//         id,
//         conversation_id as "conversationId",
//         sender_id as "senderId",
//         content,
//         is_read as "isRead",
//         created_at as timestamp
//        FROM messages 
//        WHERE conversation_id = $1 
//        ORDER BY created_at ASC`,
//       [conversationId]
//     );

//     return NextResponse.json({ messages: result.rows });
//   } catch (error) {
//     console.error('Error fetching messages:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }



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

    if (!recipientId) {
      return NextResponse.json({ error: "recipientId is required" }, { status: 400 });
    }

    // Ensure user1_id < user2_id
    const [user1_id, user2_id] = currentUserId < recipientId
      ? [currentUserId, recipientId]
      : [recipientId, currentUserId];

    // Check existing conversation
    let result = await pool.query(
      `SELECT id FROM conversations WHERE user1_id = $1 AND user2_id = $2`,
      [user1_id, user2_id]
    );

    if (result.rows.length > 0) {
      return NextResponse.json({
        conversationId: result.rows[0].id,
        isNew: false
      });
    }

    // Create new conversation
    result = await pool.query(
      `INSERT INTO conversations (user1_id, user2_id, created_at, updated_at)
       VALUES ($1, $2, NOW(), NOW())
       RETURNING id`,
      [user1_id, user2_id]
    );

    return NextResponse.json({
      conversationId: result.rows[0].id,
      isNew: true
    });

  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}