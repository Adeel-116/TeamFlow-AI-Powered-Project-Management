import { pool } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const getData = await request.json()
    console.log(getData.email, getData.password)

    try {
        const userResult = await pool.query(
            "SELECT * FROM team_members WHERE email=$1",
            [getData.email]
        );

        if (userResult.rows.length === 0) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const user = userResult.rows[0];

        if (getData.password === user.password) {
            return NextResponse.json(
                {
                    message: "Login successful",
                    user: {
                        id: user.id,
                        email: user.email,
                        role: user.role,
                    },
                },
                { status: 200 }
            );
        } else {
            return NextResponse.json({ message: "Password Not Match" }, { status: 401 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }

}