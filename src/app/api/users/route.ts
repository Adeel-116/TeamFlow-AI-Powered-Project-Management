import { pool } from "@/lib/db";

export async function POST(request:Request ) {
    
    const getData = await request.json()
    console.log(getData)

    const sentData = await pool.query(
  `INSERT INTO usersData (name, email, password, role, designation, level, department, status)
   VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
  [
    getData.name,
    getData.email,
    getData.password,
    getData.role,
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