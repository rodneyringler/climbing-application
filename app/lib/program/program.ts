import postgres from 'postgres';
import { ProgramItem, ProgramForm, ProgramsTable, ProgramExercise } from '@/app/lib/definitions';

export class Program {
  private sql: postgres.Sql;
  public name: string;
  public description: string;
  public user: string;
  public exercises: ProgramExercise[];
  
  // Optional properties for joined queries
  public userName?: string;

  constructor(data: ProgramsTable) {
    this.sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
    this.name = data.name;
    this.description = data.description;
    this.user = data.user;
    this.exercises = data.exercises;
    this.userName = data.userName;
  }

  // Instance methods for data transformation
  toFormData(): ProgramForm {
    return {
      name: this.name,
      description: this.description,
      exercises: this.exercises.map(ex => ex.id),
      userName: this.userName,
    };
  }

  toTableFormat(): ProgramsTable {
    return {
      name: this.name,
      description: this.description,
      user: this.user,
      userName: this.userName,
      exerciseCount: this.exercises.length,
      exercises: this.exercises,
    };
  }

  // Static CRUD methods
  static async create(
    name: string,
    description: string,
    user: string,
    exerciseIds: string[]
  ): Promise<Program> {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

    // Insert multiple rows for each exercise in the program
    const insertPromises = exerciseIds.map(exerciseId => 
      sql<ProgramItem[]>`
        INSERT INTO programs (id, "user", exercise, name, description)
        VALUES (gen_random_uuid(), ${user}, ${exerciseId}, ${name}, ${description})
        RETURNING *
      `
    );

    await Promise.all(insertPromises);

    // Fetch the created program with exercises
    const program = await Program.findByNameAndUser(name, user);
    if (!program) {
      throw new Error('Failed to create program');
    }

    return program;
  }

  static async findByNameAndUser(name: string, user: string): Promise<Program | null> {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
    
    const result = await sql<ProgramsTable[]>`
      SELECT
        programs.name,
        programs.description,
        programs."user",
        users.name as "userName",
        COUNT(programs.exercise) as "exerciseCount",
        ARRAY_AGG(
          JSON_BUILD_OBJECT(
            'id', exercises.id,
            'title', exercises.title,
            'exerciseType', exercises.exercisetype,
            'exerciseTypeName', exercisetypes.name,
            'isTimed', exercises.istimed,
            'reps', exercises.reps,
            'sets', exercises.sets,
            'restTime', exercises.resttime,
            'workTime', exercises.worktime,
            'isPublic', exercises.ispublic,
            'description', exercises.description
          )
        ) as exercises
      FROM programs
      INNER JOIN exercises ON programs.exercise = exercises.id
      INNER JOIN exercisetypes ON exercises.exercisetype = exercisetypes.id
      INNER JOIN users ON programs."user" = users.id
      WHERE programs.name = ${name} AND programs."user" = ${user}
      GROUP BY programs.name, programs.description, programs."user", users.name
    `;

    if (result.length === 0) {
      return null;
    }

    return new Program(result[0]);
  }

  static async update(
    oldName: string,
    newName: string,
    description: string,
    user: string,
    exerciseIds: string[]
  ): Promise<Program> {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

    // Delete existing program rows
    await sql`DELETE FROM programs WHERE name = ${oldName} AND "user" = ${user}`;

    // Insert new program rows
    const insertPromises = exerciseIds.map(exerciseId => 
      sql<ProgramItem[]>`
        INSERT INTO programs (id, "user", exercise, name, description)
        VALUES (gen_random_uuid(), ${user}, ${exerciseId}, ${newName}, ${description})
        RETURNING *
      `
    );

    await Promise.all(insertPromises);

    // Fetch the updated program
    const program = await Program.findByNameAndUser(newName, user);
    if (!program) {
      throw new Error('Failed to update program');
    }

    return program;
  }

  static async delete(name: string, user: string): Promise<void> {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
    
    await sql`DELETE FROM programs WHERE name = ${name} AND "user" = ${user}`;
  }

  static async findFiltered(query: string, page: number, itemsPerPage: number): Promise<Program[]> {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
    const offset = (page - 1) * itemsPerPage;

    // Handle empty query case
    if (!query || query.trim() === '') {
      const programs = await sql<ProgramsTable[]>`
        SELECT
          programs.name,
          programs.description,
          programs."user",
          users.name as "userName",
          COUNT(programs.exercise) as "exerciseCount",
          ARRAY_AGG(
            JSON_BUILD_OBJECT(
              'id', exercises.id,
              'title', exercises.title,
              'exerciseType', exercises.exercisetype,
              'exerciseTypeName', exercisetypes.name,
              'isTimed', exercises.istimed,
              'reps', exercises.reps,
              'sets', exercises.sets,
              'restTime', exercises.resttime,
              'workTime', exercises.worktime,
              'isPublic', exercises.ispublic,
              'description', exercises.description
            )
          ) as exercises
        FROM programs
        INNER JOIN exercises ON programs.exercise = exercises.id
        INNER JOIN exercisetypes ON exercises.exercisetype = exercisetypes.id
        INNER JOIN users ON programs."user" = users.id
        GROUP BY programs.name, programs.description, programs."user", users.name
        ORDER BY programs.name ASC
        LIMIT ${itemsPerPage} OFFSET ${offset}
      `;
      
      return programs.map(program => new Program(program));
    }

    // Sanitize and escape the query to prevent SQL injection
    const sanitizedQuery = query.trim().replace(/[%_\\]/g, '\\$&');
    const searchPattern = `%${sanitizedQuery}%`;

    try {
      const programs = await sql<ProgramsTable[]>`
        SELECT
          programs.name,
          programs.description,
          programs."user",
          users.name as "userName",
          COUNT(programs.exercise) as "exerciseCount",
          ARRAY_AGG(
            JSON_BUILD_OBJECT(
              'id', exercises.id,
              'title', exercises.title,
              'exerciseType', exercises.exercisetype,
              'exerciseTypeName', exercisetypes.name,
              'isTimed', exercises.istimed,
              'reps', exercises.reps,
              'sets', exercises.sets,
              'restTime', exercises.resttime,
              'workTime', exercises.worktime,
              'isPublic', exercises.ispublic,
              'description', exercises.description
            )
          ) as exercises
        FROM programs
        INNER JOIN exercises ON programs.exercise = exercises.id
        INNER JOIN exercisetypes ON exercises.exercisetype = exercisetypes.id
        INNER JOIN users ON programs."user" = users.id
        WHERE
          programs.name ILIKE ${searchPattern} OR
          programs.description ILIKE ${searchPattern}
        GROUP BY programs.name, programs.description, programs."user", users.name
        ORDER BY programs.name ASC
        LIMIT ${itemsPerPage} OFFSET ${offset}
      `;

      return programs.map(program => new Program(program));
    } catch (error) {
      console.error('Error in findFiltered:', error);
      throw error;
    }
  }

  static async countFiltered(query: string): Promise<number> {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

    // Handle empty query case
    if (!query || query.trim() === '') {
      const data = await sql`SELECT COUNT(DISTINCT CONCAT(programs.name, '|', programs."user"))
        FROM programs
      `;
      return Number(data[0].count);
    }

    // Sanitize and escape the query
    const sanitizedQuery = query.trim().replace(/[%_\\]/g, '\\$&');
    const searchPattern = `%${sanitizedQuery}%`;

    try {
      const data = await sql`SELECT COUNT(DISTINCT CONCAT(programs.name, '|', programs."user"))
        FROM programs
        WHERE
          programs.name ILIKE ${searchPattern} OR
          programs.description ILIKE ${searchPattern}
      `;

      return Number(data[0].count);
    } catch (error) {
      console.error('Error in countFiltered:', error);
      throw error;
    }
  }

  // Static convenience methods
  static async fetchFiltered(query: string, currentPage: number) {
    try {
      const ITEMS_PER_PAGE = 6;
      const programs = await Program.findFiltered(query, currentPage, ITEMS_PER_PAGE);
      return programs.map(program => program.toTableFormat());
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch programs.');
    }
  }

  static async fetchPages(query: string) {
    try {
      const ITEMS_PER_PAGE = 6;
      const totalCount = await Program.countFiltered(query);
      const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
      return totalPages;
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch total number of programs.');
    }
  }

  static async fetchByNameAndUser(name: string, user: string) {
    try {
      const program = await Program.findByNameAndUser(name, user);
      return program?.toFormData();
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch program.');
    }
  }
}
