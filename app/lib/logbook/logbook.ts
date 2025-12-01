import postgres from 'postgres';
import { LogbookItem, LogbookForm, LogbookTable } from '@/app/lib/definitions';
import { Exercise } from '../exercise/exercise';

export class Logbook {
  private sql: postgres.Sql;
  public id: string;
  public name: string;
  public user: string;
  public program: string;
  public workout: string;
  public date: string;
  public isPublic: boolean;
  
  // Optional properties for joined queries
  public location?: string | null;
  public notes?: string | null;
  public userName?: string;

  constructor(data: LogbookItem | LogbookForm | LogbookTable) {
    this.sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
    this.id = data.id;
    this.name = data.name;
    this.user = data.user;
    this.program = data.program;
    this.workout = data.workout;
    this.date = data.date;
    this.location = data.location;
    this.notes = data.notes;
    
    // Convert boolean values properly in case they come as strings from the database
    this.isPublic = Boolean(data.isPublic);

    
    // Set optional properties if they exist
    if ('userName' in data) {
      this.userName = data.userName;
      console.log('Set userName to:', this.userName);
    }
    if('location' in data) {
      this.location = data.location;
      console.log('Set location to: ', this.location);
    }
    if('notes' in data) {
      this.notes = data.notes;
      console.log('Set notes to: ', this.notes);
    }
  }

  // Instance methods for data transformation
  toFormData(): LogbookForm {
    return {
      id: this.id,
      name: this.name,
      user: this.user,
      program: this.program,
      workout: this.workout,
      date: this.date,
      location: this.location,
      notes: this.notes,
      isPublic: this.isPublic,
      userName: this.userName,
    };
  }

  toTableFormat(): LogbookTable {
    const result = {
      id: this.id,
      name: this.name,
      program: this.program,
      workout: this.workout,
      date: this.date,
      user: this.user,
      location: this.location,
      notes: this.notes,
      userName: this.userName,
      isPublic: this.isPublic,
    };
    //console.log('toTableFormat - exerciseTypeName:', this.exerciseTypeName, 'exerciseType:', this.exerciseType);
    return result;
  }

  // Static CRUD methods
  static async create(
    name: string,
    user: string,
    program: string,
    workout: string,
    date: string,
    location: string | null,
    notes: string | null,
    isPublic: boolean,
  ): Promise<Logbook> {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

    const result = await sql<LogbookItem[]>`
      INSERT INTO logbooks (id, name, "user", program, workout, date, location, notes, ispublic)
      VALUES (gen_random_uuid(), ${name}, ${user}, ${program}, ${workout}, ${date}, ${location}, ${notes}, ${isPublic})
      RETURNING *
    `;

    return new Logbook(result[0]);
  }

  static async findById(id: string): Promise<Logbook | null> {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
    
    const result = await sql<LogbookForm[]>`
      SELECT
        logbooks.id,
        logbooks.name,
        logbooks."user",
        logbooks.program,
        logbooks.workout,
        logbooks.date,
        logbooks.location,
        logbooks.notes,
        logbooks.ispublic as "isPublic",
        users.name as "userName"
      FROM logbooks
      INNER JOIN users ON logbooks."user" = users.id
      WHERE logbooks.id = ${id}
    `;

    if (result.length === 0) {
      return null;
    }

    return new Logbook(result[0]);
  }

  static async update(
    id: string,
    name: string,
    user: string,
    program: string,
    workout: string,
    date: string,
    location: string,
    notes: string,
    isPublic: boolean,
  ): Promise<Logbook> {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

    const result = await sql<LogbookItem[]>`
      UPDATE logbooks
      SET name = ${name}, "user" = ${user}, program = ${program}, workout = ${workout}, date = ${date},
          location = ${location}, notes = ${notes}, ispublic = ${isPublic}
      WHERE id = ${id}
      RETURNING *
    `;

    return new Logbook(result[0]);
  }

  static async delete(id: string): Promise<void> {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
    
    await sql`DELETE FROM logbooks WHERE id = ${id}`;
  }

  static async findFiltered(query: string, page: number, itemsPerPage: number): Promise<Logbook[]> {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
    const offset = (page - 1) * itemsPerPage;

    // Handle empty query case
    if (!query || query.trim() === '') {
      const exercises = await sql<LogbookTable[]>`
        SELECT
          logbooks.id,
          logbooks.title,
          users.name as "user",
          logbooks.exercisetype as "exerciseType",
          logbooks.istimed as "isTimed",
          logbooks.reps,
          logbooks.sets,
          logbooks.resttime as "restTime",
          logbooks.worktime as "workTime",
          logbooks.ispublic as "isPublic",
          logbooks.description,
        FROM logbooks
        INNER JOIN users ON logbooks."user" = users.id
        ORDER BY logbooks.name ASC
        LIMIT ${itemsPerPage} OFFSET ${offset}
      `;
      
      return logbooks.map(logbook => new Logbook(logbook));
    }

    // Sanitize and escape the query to prevent SQL injection and special character issues
    const sanitizedQuery = query.trim().replace(/[%_\\]/g, '\\$&');
    const searchPattern = `%${sanitizedQuery}%`;

    try {
      // Try a simpler approach first - search only on text fields
      const exercises = await sql<LogbookTable[]>`
        SELECT
          logbooks.id,
          logbooks.name,
          users.name as "user",
          logbooks.program as "program",
          logbooks.workout as "workout",
          logbooks.date as "date",
          logbooks.location as "location",
          logbooks.notes as "notes",
          logbooks.ispublic as "isPublic"
        FROM logbooks
        INNER JOIN users ON logbooks."user" = users.id
        WHERE
          logbooks.name ILIKE ${searchPattern} OR
          users.name ILIKE ${searchPattern} OR
        ORDER BY logbooks.name ASC
        LIMIT ${itemsPerPage} OFFSET ${offset}
      `;

      return logbooks.map(logbook => new Logbook(logbook));
    } catch (error) {
      console.error('Error in findFiltered:', error);
      console.error('Query:', query);
      console.error('Sanitized query:', sanitizedQuery);
      
      // Fallback: try without the JOIN to see if that's the issue
      try {
        console.log('Trying fallback query without JOIN...');
        const logbooks = await sql<LogbookTable[]>`
          SELECT
            logbooks.id,
            logbooks.name,
            logbooks."user",
            logbooks.program as "program",
            logbooks.workout as "workout",
            logbooks.date as "date",
            logbooks.location as "location",
            logbooks.notes as "notes",
            logbooks.ispublic as "isPublic"
          FROM logbooks
          WHERE
            logbooks.name ILIKE ${searchPattern} OR
            logbooks.program ILIKE ${searchPattern} OR
            logbooks.workout ILIKE ${searchPattern} OR
            logbooks.location ILIKE ${searchPattern} OR
            logbooks.notes ILIKE ${searchPattern}
          ORDER BY logbooks.name ASC
          LIMIT ${itemsPerPage} OFFSET ${offset}
        `;
        
        return logbooks.map(logbooks => new Logbook(logbooks));
      } catch (fallbackError) {
        console.error('Fallback query also failed:', fallbackError);
        throw error; // Throw the original error
      }
    }
  }

  static async countFiltered(query: string): Promise<number> {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

    // Handle empty query case
    if (!query || query.trim() === '') {
      const data = await sql`SELECT COUNT(*)
        FROM logbooks
      `;
      return Number(data[0].count);
    }

    // Sanitize and escape the query to prevent SQL injection and special character issues
    const sanitizedQuery = query.trim().replace(/[%_\\]/g, '\\$&');
    const searchPattern = `%${sanitizedQuery}%`;

    try {
      // Try a simpler approach first - search only on text fields
      const data = await sql`SELECT COUNT(*)
        FROM logbooks
        WHERE
          logbooks.name ILIKE ${searchPattern} OR
          logbooks.program ILIKE ${searchPattern} OR
          logbooks.workout ILIKE ${searchPattern} OR
          logbooks.location ILIKE ${searchPattern} OR
          logbooks.notes ILIKE ${searchPattern}
      `;

      return Number(data[0].count);
    } catch (error) {
      console.error('Error in countFiltered:', error);
      console.error('Query:', query);
      console.error('Sanitized query:', sanitizedQuery);
      
      // Fallback: try without the JOIN to see if that's the issue
      try {
        console.log('Trying fallback count query without JOIN...');
        const data = await sql`SELECT COUNT(*)
          FROM logbooks
          WHERE
            logbooks.name ILIKE ${searchPattern} OR
            logbooks."user" ILIKE ${searchPattern} OR
            logbooks.notes ILIKE ${searchPattern}
        `;
        
        return Number(data[0].count);
      } catch (fallbackError) {
        console.error('Fallback count query also failed:', fallbackError);
        throw error; // Throw the original error
      }
    }
  }

  // Static convenience methods that replace the functions from data.ts
  static async fetchAll(query: string) {
    try {
      const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
      const logbooks = await sql`select * from logbooks;`;
      return logbooks;
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch logbooks.');
    }
  }

  static async fetchFiltered(query: string, currentPage: number) {
    try {
      const ITEMS_PER_PAGE = 6;
      const logbooks = await Logbook.findFiltered(query, currentPage, ITEMS_PER_PAGE);
      return logbooks.map(logbook => logbook.toTableFormat());
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch exercises.');
    }
  }

  static async fetchPages(query: string) {
    try {
      const ITEMS_PER_PAGE = 6;
      const totalCount = await Logbook.countFiltered(query);
      const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
      return totalPages;
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch total number of logbooks.');
    }
  }

  static async fetchById(id: string) {
    try {
      const logbook = await Logbook.findById(id);
      return logbook?.toFormData();
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch logbook.');
    }
  }
}
