import { pool } from "@/lib/db";

export async function POST(request:Request ) {
    
    const getData = await request.json()
    console.log(getData)

    const sentData = await pool.query(
  `INSERT INTO users (name, email, password, role, designation, level, department, status)
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