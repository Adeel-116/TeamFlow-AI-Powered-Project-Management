import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        console.log(body.currentUserId)

        if (!body.currentUserId) {
            return NextResponse.json({ message: "userid is required" }, { status: 400 });
        }

        await pool.query(
            `UPDATE team_members 
            SET last_seen = NOW()
            WHERE uuid_id = $1`,
            [body.currentUserId]
        );
        return NextResponse.json({ message: "updated successfully" }, { status: 200 });
        } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Error When I update the last_seen" }, { status: 500 });
        }
}