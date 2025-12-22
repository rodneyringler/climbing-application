import postgres from 'postgres';
import { ProgramItem, ProgramForm, ProgramsTable, ProgramCategory, ProgramExercise } from '@/app/lib/definitions';

export class Program {
  private sql: postgres.Sql;
  public id: string;
  public name: string;
  public description: string;
  public categories: string[]; // Array of category IDs
  public categoryDetails: ProgramCategory[]; // Array of category details
  public user: string;
  public exercises: ProgramExercise[];
  
  // Optional properties for joined queries
  public userName?: string;

  constructor(data: ProgramsTable & { categories?: string[]; categoryDetails?: ProgramCategory[] }) {
    this.sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.user = data.user;
    this.exercises = data.exercises;
    this.categories = data.categories || [];
    this.categoryDetails = data.categoryDetails || [];
    this.userName = data.userName;
  }

  // Instance methods for data transformation
  toFormData(): ProgramForm {
    return {
      name: this.name,
      description: this.description,
      categories: this.categories,
      exercises: this.exercises.map(ex => ex.id),
      userName: this.userName,
    };
  }

  toTableFormat(): ProgramsTable {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      user: this.user,
      userName: this.userName,
      exerciseCount: this.exercises.length,
      exercises: this.exercises,
      categories: this.categoryDetails,
    };
  }

  // Static CRUD methods
  static async create(
    name: string,
    description: string,
    user: string,
    categoryIds: string[],
    exerciseIds: string[]
  ): Promise<Program> {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

    try {
      // Insert one row into programs table
      const programResult = await sql<ProgramItem[]>`
        INSERT INTO programs (id, "user", name, description)
        VALUES (gen_random_uuid(), ${user}, ${name}, ${description})
        RETURNING *
      `;

      if (programResult.length === 0) {
        throw new Error('Failed to create program');
      }

      const programId = programResult[0].id;

      // Insert rows into programcategory table (one per category)
      if (categoryIds.length > 0) {
        const categoryPromises = categoryIds.map(categoryId => 
          sql`
            INSERT INTO programcategory (program, category)
            VALUES (${programId}, ${categoryId})
          `
        );
        await Promise.all(categoryPromises);
      }

      // Insert rows into programexercises table (one per exercise)
      if (exerciseIds.length > 0) {
        const insertPromises = exerciseIds.map(exerciseId => 
          sql`
            INSERT INTO programexercises (program, exercise)
            VALUES (${programId}, ${exerciseId})
          `
        );
        await Promise.all(insertPromises);
      }

      // Fetch the created program with exercises
      const program = await Program.findByNameAndUser(name, user);
      if (!program) {
        throw new Error('Failed to create program');
      }

      return program;
    } catch (error: any) {
      // Handle unique constraint violation for program name
      if (error?.code === '23505' || error?.message?.includes('unique')) {
        throw new Error('A program with this name already exists');
      }
      throw error;
    }
  }

  static async findByNameAndUser(name: string, user: string): Promise<Program | null> {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
    
    const result = await sql<ProgramsTable[]>`
      SELECT
        programs.id,
        programs.name,
        programs.description,
        programs."user",
        users.name as "userName",
        COUNT(programexercises.exercise) as "exerciseCount",
        COALESCE(
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
          ) FILTER (WHERE exercises.id IS NOT NULL),
          ARRAY[]::json[]
        ) as exercises
      FROM programs
      LEFT JOIN programexercises ON programs.id = programexercises.program
      LEFT JOIN exercises ON programexercises.exercise = exercises.id
      LEFT JOIN exercisetypes ON exercises.exercisetype = exercisetypes.id
      INNER JOIN users ON programs."user" = users.id
      WHERE programs.name = ${name} AND programs."user" = ${user}
      GROUP BY programs.id, programs.name, programs.description, programs."user", users.name
    `;

    if (result.length === 0) {
      return null;
    }

    // Fetch categories separately
    const categoriesResult = await sql<{ category: string }[]>`
      SELECT category
      FROM programcategory
      WHERE program = ${result[0].id}
    `;

    const categoryIds = categoriesResult.map(row => row.category);
    
    // Fetch category details
    const categoryDetails: ProgramCategory[] = categoryIds.length > 0 ? await sql<ProgramCategory[]>`
      SELECT id, name, description
      FROM categories
      WHERE id = ANY(${categoryIds})
    ` : [];

    const { categories: _, ...programData } = result[0];
    return new Program({ 
      ...programData, 
      categories: categoryIds, 
      categoryDetails 
    } as unknown as ProgramsTable & { categories: string[]; categoryDetails: ProgramCategory[] });
  }

  static async update(
    oldName: string,
    newName: string,
    description: string,
    user: string,
    categoryIds: string[],
    exerciseIds: string[]
  ): Promise<Program> {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

    try {
      // Find the existing program to get its ID
      const existingProgram = await Program.findByNameAndUser(oldName, user);
      if (!existingProgram) {
        throw new Error('Program not found');
      }

      const programId = existingProgram.id;

      // Update the program row
      await sql`
        UPDATE programs
        SET name = ${newName}, description = ${description}
        WHERE id = ${programId} AND "user" = ${user}
      `;

      // Delete existing programcategory rows
      await sql`
        DELETE FROM programcategory
        WHERE program = ${programId}
      `;

      // Insert new programcategory rows
      if (categoryIds.length > 0) {
        const categoryPromises = categoryIds.map(categoryId => 
          sql`
            INSERT INTO programcategory (program, category)
            VALUES (${programId}, ${categoryId})
          `
        );
        await Promise.all(categoryPromises);
      }

      // Delete existing programexercises rows
      await sql`
        DELETE FROM programexercises
        WHERE program = ${programId}
      `;

      // Insert new programexercises rows
      if (exerciseIds.length > 0) {
        const insertPromises = exerciseIds.map(exerciseId => 
          sql`
            INSERT INTO programexercises (program, exercise)
            VALUES (${programId}, ${exerciseId})
          `
        );
        await Promise.all(insertPromises);
      }

      // Fetch the updated program
      const program = await Program.findByNameAndUser(newName, user);
      if (!program) {
        throw new Error('Failed to update program');
      }

      return program;
    } catch (error: any) {
      // Handle unique constraint violation for program name
      if (error?.code === '23505' || error?.message?.includes('unique')) {
        throw new Error('A program with this name already exists');
      }
      throw error;
    }
  }

  static async delete(name: string, user: string): Promise<void> {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
    
    // Find the program to get its ID
    const program = await Program.findByNameAndUser(name, user);
    if (!program) {
      throw new Error('Program not found');
    }

    const programId = program.id;

    // Delete from programexercises first (foreign key constraint)
    await sql`DELETE FROM programexercises WHERE program = ${programId}`;
    
    // Delete from programs table
    await sql`DELETE FROM programs WHERE id = ${programId} AND "user" = ${user}`;
  }

  static async findFiltered(query: string, page: number, itemsPerPage: number): Promise<Program[]> {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
    const offset = (page - 1) * itemsPerPage;

    // Handle empty query case
    if (!query || query.trim() === '') {
      const programs = await sql<ProgramsTable[]>`
        SELECT
          programs.id,
          programs.name,
          programs.description,
          programs."user",
          users.name as "userName",
          COUNT(programexercises.exercise) as "exerciseCount",
          COALESCE(
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
            ) FILTER (WHERE exercises.id IS NOT NULL),
            ARRAY[]::json[]
          ) as exercises
        FROM programs
        LEFT JOIN programexercises ON programs.id = programexercises.program
        LEFT JOIN exercises ON programexercises.exercise = exercises.id
        LEFT JOIN exercisetypes ON exercises.exercisetype = exercisetypes.id
        INNER JOIN users ON programs."user" = users.id
        GROUP BY programs.id, programs.name, programs.description, programs."user", users.name
        ORDER BY programs.name ASC
        LIMIT ${itemsPerPage} OFFSET ${offset}
      `;
      
      // Fetch categories for each program
      const programsWithCategories = await Promise.all(
        programs.map(async (program) => {
          const categoriesResult = await sql<{ category: string }[]>`
            SELECT category
            FROM programcategory
            WHERE program = ${program.id}
          `;
          const categoryIds = categoriesResult.map(row => row.category);
          
          // Fetch category details
          const categoryDetails: ProgramCategory[] = categoryIds.length > 0 ? await sql<ProgramCategory[]>`
            SELECT id, name, description
            FROM categories
            WHERE id = ANY(${categoryIds})
          ` : [];
          
          const { categories: _, ...programData } = program;
          return new Program({ 
            ...programData, 
            categories: categoryIds, 
            categoryDetails 
          } as unknown as ProgramsTable & { categories: string[]; categoryDetails: ProgramCategory[] });
        })
      );
      
      return programsWithCategories;
    }

    // Sanitize and escape the query to prevent SQL injection
    const sanitizedQuery = query.trim().replace(/[%_\\]/g, '\\$&');
    const searchPattern = `%${sanitizedQuery}%`;

    try {
      const programs = await sql<ProgramsTable[]>`
        SELECT
          programs.id,
          programs.name,
          programs.description,
          programs."user",
          users.name as "userName",
          COUNT(programexercises.exercise) as "exerciseCount",
          COALESCE(
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
            ) FILTER (WHERE exercises.id IS NOT NULL),
            ARRAY[]::json[]
          ) as exercises
        FROM programs
        LEFT JOIN programexercises ON programs.id = programexercises.program
        LEFT JOIN exercises ON programexercises.exercise = exercises.id
        LEFT JOIN exercisetypes ON exercises.exercisetype = exercisetypes.id
        INNER JOIN users ON programs."user" = users.id
        WHERE
          programs.name ILIKE ${searchPattern} OR
          programs.description ILIKE ${searchPattern}
        GROUP BY programs.id, programs.name, programs.description, programs."user", users.name
        ORDER BY programs.name ASC
        LIMIT ${itemsPerPage} OFFSET ${offset}
      `;

      // Fetch categories for each program
      const programsWithCategories = await Promise.all(
        programs.map(async (program) => {
          const categoriesResult = await sql<{ category: string }[]>`
            SELECT category
            FROM programcategory
            WHERE program = ${program.id}
          `;
          const categoryIds = categoriesResult.map(row => row.category);
          
          // Fetch category details
          const categoryDetails: ProgramCategory[] = categoryIds.length > 0 ? await sql<ProgramCategory[]>`
            SELECT id, name, description
            FROM categories
            WHERE id = ANY(${categoryIds})
          ` : [];
          
          const { categories: _, ...programData } = program;
          return new Program({ 
            ...programData, 
            categories: categoryIds, 
            categoryDetails 
          } as unknown as ProgramsTable & { categories: string[]; categoryDetails: ProgramCategory[] });
        })
      );

      return programsWithCategories;
    } catch (error) {
      console.error('Error in findFiltered:', error);
      throw error;
    }
  }

  static async countFiltered(query: string): Promise<number> {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

    // Handle empty query case
    if (!query || query.trim() === '') {
      const data = await sql`SELECT COUNT(*)
        FROM programs
      `;
      return Number(data[0].count);
    }

    // Sanitize and escape the query
    const sanitizedQuery = query.trim().replace(/[%_\\]/g, '\\$&');
    const searchPattern = `%${sanitizedQuery}%`;

    try {
      const data = await sql`SELECT COUNT(*)
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
