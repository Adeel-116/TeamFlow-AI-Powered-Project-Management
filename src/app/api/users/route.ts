import { pool } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:Request ) {
    
    const getData = await request.json()
    console.log(getData)

    const sentData = await pool.query(
  `INSERT INTO usersData (name, email, password, designation, level, department, status)
   VALUES ($1, $2, $3, $4, $5, $6, $7)`,
  [
    getData.name,
    getData.email,
    getData.password,
    getData.designation,
    getData.level,
    getData.department,
    getData.status,
  ]
);
  return Response.json({ success: true, message: "User added successfully!", userData: sentData });
}

export async function GET(req: Request) {
    const result = await pool.query("SELECT * FROM usersData")
    return Response.json({success: true, message: "GET data Form DataBase", getData: result})
}

export async function DELETE(req:Request){
    const getData = await req.json();
    console.log(getData);

    const deleteRecord = await pool.query(
      'DELETE FROM usersData WHERE email = $1',
      [getData.email]
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: "Deleted data from database",
        deletedRecord: deleteRecord,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

}

export async function PUT(req: Request) {
  try {
     const body = await req.json();
    console.log(body)

    if (!body.id || !body.name || !body.email) {
      return NextResponse.json({ message: "ID, name, and email are required" }, { status: 400 });
    }

    await pool.query(
      `UPDATE usersData 
       SET name = $1, 
           email = $2, 
           designation = $3, 
           level = $4, 
           department = $5, 
           status = $6 
       WHERE ID = $7`,
      [body.name, body.email, body.designation, body.level, body.department, body.status, body.id]
    );

    return NextResponse.json({ message: "Member updated successfully" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed to update member" }, { status: 500 });
  }
}