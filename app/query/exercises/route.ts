import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function listExercises() {
	// TODO: Update this query based on your exercises table schema
	const data = await sql`
    Select * from exercises;
  `;

	return data;
}

export async function GET() {
  try {
  	return Response.json(await listExercises());
  } catch (error) {
  	return Response.json({ error }, { status: 500 });
  }
}
