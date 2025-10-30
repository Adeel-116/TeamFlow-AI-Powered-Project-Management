

// import { NextResponse } from 'next/server';
// import { pool } from '@/lib/db';
// import { cookies } from "next/headers";
// import jwt from "jsonwebtoken";

// export async function POST(request: Request) {
//   try {
//     const token = (await cookies()).get("token")?.value;
//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET_KEY!);
//     const currentUserId = decodedToken.uuid_id;

//     const { recipientId } = await request.json();

//     if (!recipientId) {
//       return NextResponse.json({ error: "recipientId is required" }, { status: 400 });
//     }

//     // Ensure user1_id < user2_id
//     const [user1_id, user2_id] = currentUserId < recipientId
//       ? [currentUserId, recipientId]
//       : [recipientId, currentUserId];

//     // Check existing conversation
//     let result = await pool.query(
//       `SELECT id FROM conversations WHERE user1_id = $1 AND user2_id = $2`,
//       [user1_id, user2_id]
//     );

//     if (result.rows.length > 0) {
//       return NextResponse.json({
//         conversationId: result.rows[0].id,
//         isNew: false
//       });
//     }

//     // Create new conversation
//     result = await pool.query(
//       `INSERT INTO conversations (user1_id, user2_id, created_at, updated_at)
//        VALUES ($1, $2, NOW(), NOW())
//        RETURNING id`,
//       [user1_id, user2_id]
//     );

//     return NextResponse.json({
//       conversationId: result.rows[0].id,
//       isNew: true
//     });

//   } catch (error) {
//     console.error('Error creating conversation:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse, } from 'next/server';
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { pool } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { senderId, receiverId } = data;

    if (!senderId || !receiverId) {
      return NextResponse.json({ error: "Missing user IDs" }, { status: 400 });
    }

    const [user1_id, user2_id] =
      senderId < receiverId ? [senderId, receiverId] : [receiverId, senderId];

    const existing = await pool.query(
      `SELECT id FROM conversations WHERE user1_id = $1 AND user2_id = $2`,
      [user1_id, user2_id]
    );

    if (existing.rows.length > 0) {
      return NextResponse.json({
        conversationId: existing.rows[0].id,
        isNew: false
      });
    }

    const result = await pool.query(
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
