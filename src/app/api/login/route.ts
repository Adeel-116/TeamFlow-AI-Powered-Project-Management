import { pool } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import  jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  const getData = await request.json();

  try {
    const userResult = await pool.query(
      "SELECT * FROM team_members WHERE email=$1",
      [getData.email]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const user = userResult.rows[0];

    if (getData.password !== user.password) {
      return NextResponse.json(
        { message: "Incorrect password" },
        { status: 401 }
      );
    }

    const newUserData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(newUserData, process.env.JWT_SECRET_KEY as string, {
      expiresIn: "1h",
    });

    const response = NextResponse.json(
      {
        message: "Login successful",
        user: newUserData,
      },
      { status: 200 }
    );

   response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // ✅ Added
      path: "/", // ✅ Added - Important!
      maxAge: 60 * 60 * 24 * 7, // ✅ 7 days
    });

    console.log("✅ Cookie set successfully");

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}