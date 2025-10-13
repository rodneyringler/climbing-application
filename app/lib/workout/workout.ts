import postgres from 'postgres';
import { WorkoutItem, WorkoutForm, WorkoutsTable } from '@/app/lib/definitions';

export class Workout {
  private sql: postgres.Sql;
  public id: string;
  public user: string;
  public program: string;
  public name: string;
  public started: string | null;
  public ended: string | null;
  
  // Optional properties for joined queries
  public userName?: string;
  public programName?: string;

  constructor(data: WorkoutItem | WorkoutForm | WorkoutsTable) {
    this.sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
    this.id = data.id;
    this.user = data.user;
    this.program = data.program;
    this.name = data.name;
    this.started = data.started;
    this.ended = data.ended;
    
    // Set optional properties if they exist
    if ('userName' in data) {
      this.userName = data.userName;
    }
    if ('programName' in data) {
      this.programName = data.programName;
    }
  }

  // Instance methods for data transformation
  toFormData(): WorkoutForm {
    return {
      id: this.id,
      user: this.user,
      program: this.program,
      name: this.name,
      started: this.started,
      ended: this.ended,
      userName: this.userName,
      programName: this.programName,
    };
  }

  toTableFormat(): WorkoutsTable {
    return {
      id: this.id,
      user: this.user,
      program: this.program,
      name: this.name,
      started: this.started,
      ended: this.ended,
      userName: this.userName,
      programName: this.programName,
    };
  }

  // Calculate duration if both started and ended exist
  getDuration(): string | null {
    if (!this.started || !this.ended) {
      return null;
    }
    
    const start = new Date(this.started);
    const end = new Date(this.ended);
    const diffMs = end.getTime() - start.getTime();
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }

  // Static CRUD methods
  static async create(
    user: string,
    program: string,
    name: string,
    started: string | null,
    ended: string | null
  ): Promise<Workout> {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

    const result = await sql<WorkoutItem[]>`
      INSERT INTO workouts (id, "user", program, name, started, ended)
      VALUES (gen_random_uuid(), ${user}, ${program}, ${name}, ${started}, ${ended})
      RETURNING *
    `;

    return new Workout(result[0]);
  }

  static async findById(id: string): Promise<Workout | null> {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
    
    const result = await sql<WorkoutForm[]>`
      SELECT
        workouts.id,
        workouts."user",
        workouts.program,
        workouts.name,
        workouts.started,
        workouts.ended,
        users.name as "userName",
        workouts.program as "programName"
      FROM workouts
      INNER JOIN users ON workouts."user" = users.id
      WHERE workouts.id = ${id}
    `;

    if (result.length === 0) {
      return null;
    }

    return new Workout(result[0]);
  }

  static async update(
    id: string,
    user: string,
    program: string,
    name: string,
    started: string | null,
    ended: string | null
  ): Promise<Workout> {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

    const result = await sql<WorkoutItem[]>`
      UPDATE workouts
      SET "user" = ${user}, program = ${program}, name = ${name}, 
          started = ${started}, ended = ${ended}
      WHERE id = ${id}
      RETURNING *
    `;

    return new Workout(result[0]);
  }

  static async delete(id: string): Promise<void> {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
    
    await sql`DELETE FROM workouts WHERE id = ${id}`;
  }

  static async findFiltered(query: string, page: number, itemsPerPage: number, userId: string): Promise<Workout[]> {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
    const offset = (page - 1) * itemsPerPage;

    // Handle empty query case
    if (!query || query.trim() === '') {
      const workouts = await sql<WorkoutsTable[]>`
        SELECT
          workouts.id,
          workouts."user",
          workouts.program,
          workouts.name,
          workouts.started,
          workouts.ended,
          users.name as "userName",
          workouts.program as "programName"
        FROM workouts
        INNER JOIN users ON workouts."user" = users.id
        WHERE workouts."user" = ${userId}
        ORDER BY workouts.started DESC NULLS LAST, workouts.name ASC
        LIMIT ${itemsPerPage} OFFSET ${offset}
      `;
      
      return workouts.map(workout => new Workout(workout));
    }

    // Sanitize and escape the query to prevent SQL injection
    const sanitizedQuery = query.trim().replace(/[%_\\]/g, '\\$&');
    const searchPattern = `%${sanitizedQuery}%`;

    try {
      const workouts = await sql<WorkoutsTable[]>`
        SELECT
          workouts.id,
          workouts."user",
          workouts.program,
          workouts.name,
          workouts.started,
          workouts.ended,
          users.name as "userName",
          workouts.program as "programName"
        FROM workouts
        INNER JOIN users ON workouts."user" = users.id
        WHERE workouts."user" = ${userId} AND (
          workouts.name ILIKE ${searchPattern} OR
          workouts.program ILIKE ${searchPattern} OR
          users.name ILIKE ${searchPattern}
        )
        ORDER BY workouts.started DESC NULLS LAST, workouts.name ASC
        LIMIT ${itemsPerPage} OFFSET ${offset}
      `;

      return workouts.map(workout => new Workout(workout));
    } catch (error) {
      console.error('Error in findFiltered:', error);
      throw error;
    }
  }

  static async countFiltered(query: string, userId: string): Promise<number> {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

    // Handle empty query case
    if (!query || query.trim() === '') {
      const data = await sql`SELECT COUNT(*)
        FROM workouts
        WHERE workouts."user" = ${userId}
      `;
      return Number(data[0].count);
    }

    // Sanitize and escape the query
    const sanitizedQuery = query.trim().replace(/[%_\\]/g, '\\$&');
    const searchPattern = `%${sanitizedQuery}%`;

    try {
      const data = await sql`SELECT COUNT(*)
        FROM workouts
        INNER JOIN users ON workouts."user" = users.id
        WHERE workouts."user" = ${userId} AND (
          workouts.name ILIKE ${searchPattern} OR
          workouts.program ILIKE ${searchPattern} OR
          users.name ILIKE ${searchPattern}
        )
      `;

      return Number(data[0].count);
    } catch (error) {
      console.error('Error in countFiltered:', error);
      throw error;
    }
  }

  // Static convenience methods
  static async fetchFiltered(query: string, currentPage: number, userId: string) {
    try {
      const ITEMS_PER_PAGE = 6;
      const workouts = await Workout.findFiltered(query, currentPage, ITEMS_PER_PAGE, userId);
      return workouts.map(workout => workout.toTableFormat());
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch workouts.');
    }
  }

  static async fetchPages(query: string, userId: string) {
    try {
      const ITEMS_PER_PAGE = 6;
      const totalCount = await Workout.countFiltered(query, userId);
      const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
      return totalPages;
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch total number of workouts.');
    }
  }

  static async fetchById(id: string) {
    try {
      const workout = await Workout.findById(id);
      return workout?.toFormData();
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch workout.');
    }
  }
}
