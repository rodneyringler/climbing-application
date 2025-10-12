import postgres from 'postgres';
import { ExerciseItem, ExerciseForm, ExercisesTable } from '@/app/lib/definitions';

export class Exercise {
  private sql: postgres.Sql;
  public id: string;
  public title: string;
  public user: string;
  public exerciseType: string;
  public isTimed: boolean;
  public reps: number;
  public sets: number;
  public restTime: number;
  public workTime: number;
  public isPublic: boolean;
  public description: string;
  
  // Optional properties for joined queries
  public exerciseTypeName?: string;
  public userName?: string;

  constructor(data: ExerciseItem | ExerciseForm | ExercisesTable) {
    this.sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
    this.id = data.id;
    this.title = data.title;
    this.user = data.user;
    this.exerciseType = data.exerciseType;
    
    // Convert boolean values properly in case they come as strings from the database
    this.isTimed = Boolean(data.isTimed);
    this.reps = Number(data.reps) || 0;
    this.sets = Number(data.sets) || 0;
    this.restTime = Number(data.restTime) || 0;
    this.workTime = Number(data.workTime) || 0;
    this.isPublic = Boolean(data.isPublic);
    this.description = data.description;
    
    // Set optional properties if they exist
    if ('exerciseTypeName' in data) {
      this.exerciseTypeName = data.exerciseTypeName;
      console.log('Set exerciseTypeName to:', this.exerciseTypeName);
    }
    if ('userName' in data) {
      this.userName = data.userName;
      console.log('Set userName to:', this.userName);
    }
  }

  // Instance methods for data transformation
  toFormData(): ExerciseForm {
    return {
      id: this.id,
      title: this.title,
      user: this.user,
      exerciseType: this.exerciseType,
      isTimed: this.isTimed,
      reps: this.reps,
      sets: this.sets,
      restTime: this.restTime,
      workTime: this.workTime,
      isPublic: this.isPublic,
      description: this.description,
      userName: this.userName,
    };
  }

  toTableFormat(): ExercisesTable {
    const result = {
      id: this.id,
      title: this.title,
      user: this.user,
      exerciseType: this.exerciseType,
      isTimed: this.isTimed,
      reps: this.reps,
      sets: this.sets,
      restTime: this.restTime,
      workTime: this.workTime,
      isPublic: this.isPublic,
      description: this.description,
      exerciseTypeName: this.exerciseTypeName,
    };
    console.log('toTableFormat - exerciseTypeName:', this.exerciseTypeName, 'exerciseType:', this.exerciseType);
    return result;
  }

  // Static CRUD methods
  static async create(
    title: string,
    user: string,
    exerciseType: string,
    isTimed: boolean,
    reps: number,
    sets: number,
    restTime: number,
    workTime: number,
    isPublic: boolean,
    description: string
  ): Promise<Exercise> {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

    const result = await sql<ExerciseItem[]>`
      INSERT INTO exercises (id, title, "user", exercisetype, istimed, reps, sets, resttime, worktime, ispublic, description)
      VALUES (gen_random_uuid(), ${title}, ${user}, ${exerciseType}, ${isTimed}, ${reps}, ${sets}, ${restTime}, ${workTime}, ${isPublic}, ${description})
      RETURNING *
    `;

    return new Exercise(result[0]);
  }

  static async findById(id: string): Promise<Exercise | null> {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
    
    const result = await sql<ExerciseForm[]>`
      SELECT
        exercises.id,
        exercises.title,
        exercises."user",
        exercises.exercisetype as "exerciseType",
        exercises.istimed as "isTimed",
        exercises.reps,
        exercises.sets,
        exercises.resttime as "restTime",
        exercises.worktime as "workTime",
        exercises.ispublic as "isPublic",
        exercises.description,
        users.name as "userName"
      FROM exercises
      INNER JOIN users ON exercises."user" = users.id
      WHERE exercises.id = ${id}
    `;

    if (result.length === 0) {
      return null;
    }

    return new Exercise(result[0]);
  }

  static async update(
    id: string,
    title: string,
    user: string,
    exerciseType: string,
    isTimed: boolean,
    reps: number,
    sets: number,
    restTime: number,
    workTime: number,
    isPublic: boolean,
    description: string
  ): Promise<Exercise> {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

    const result = await sql<ExerciseItem[]>`
      UPDATE exercises
      SET title = ${title}, "user" = ${user}, exercisetype = ${exerciseType}, 
          istimed = ${isTimed}, reps = ${reps}, sets = ${sets}, resttime = ${restTime}, 
          worktime = ${workTime}, ispublic = ${isPublic}, description = ${description}
      WHERE id = ${id}
      RETURNING *
    `;

    return new Exercise(result[0]);
  }

  static async delete(id: string): Promise<void> {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
    
    await sql`DELETE FROM exercises WHERE id = ${id}`;
  }

  static async findFiltered(query: string, page: number, itemsPerPage: number): Promise<Exercise[]> {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
    const offset = (page - 1) * itemsPerPage;

    // Handle empty query case
    if (!query || query.trim() === '') {
      const exercises = await sql<ExercisesTable[]>`
        SELECT
          exercises.id,
          exercises.title,
          users.name as "user",
          exercises.exercisetype as "exerciseType",
          exercises.istimed as "isTimed",
          exercises.reps,
          exercises.sets,
          exercises.resttime as "restTime",
          exercises.worktime as "workTime",
          exercises.ispublic as "isPublic",
          exercises.description,
          exercisetypes.name as "exerciseTypeName"
        FROM exercises
        INNER JOIN exercisetypes ON exercises.exercisetype = exercisetypes.id
        INNER JOIN users ON exercises."user" = users.id
        ORDER BY exercises.title ASC
        LIMIT ${itemsPerPage} OFFSET ${offset}
      `;
      
      return exercises.map(exercise => new Exercise(exercise));
    }

    // Sanitize and escape the query to prevent SQL injection and special character issues
    const sanitizedQuery = query.trim().replace(/[%_\\]/g, '\\$&');
    const searchPattern = `%${sanitizedQuery}%`;

    try {
      // Try a simpler approach first - search only on text fields
      const exercises = await sql<ExercisesTable[]>`
        SELECT
          exercises.id,
          exercises.title,
          users.name as "user",
          exercises.exercisetype as "exerciseType",
          exercises.istimed as "isTimed",
          exercises.reps,
          exercises.sets,
          exercises.resttime as "restTime",
          exercises.worktime as "workTime",
          exercises.ispublic as "isPublic",
          exercises.description,
          exercisetypes.name as "exerciseTypeName"
        FROM exercises
        INNER JOIN exercisetypes ON exercises.exercisetype = exercisetypes.id
        INNER JOIN users ON exercises."user" = users.id
        WHERE
          exercises.title ILIKE ${searchPattern} OR
          exercises.description ILIKE ${searchPattern} OR
          users.name ILIKE ${searchPattern} OR
          exercisetypes.name ILIKE ${searchPattern}
        ORDER BY exercises.title ASC
        LIMIT ${itemsPerPage} OFFSET ${offset}
      `;

      return exercises.map(exercise => new Exercise(exercise));
    } catch (error) {
      console.error('Error in findFiltered:', error);
      console.error('Query:', query);
      console.error('Sanitized query:', sanitizedQuery);
      
      // Fallback: try without the JOIN to see if that's the issue
      try {
        console.log('Trying fallback query without JOIN...');
        const exercises = await sql<ExercisesTable[]>`
          SELECT
            exercises.id,
            exercises.title,
            exercises."user",
            exercises.exercisetype as "exerciseType",
            exercises.istimed as "isTimed",
            exercises.reps,
            exercises.sets,
            exercises.resttime as "restTime",
            exercises.worktime as "workTime",
            exercises.ispublic as "isPublic",
            exercises.description
          FROM exercises
          WHERE
            exercises.title ILIKE ${searchPattern} OR
            exercises."user" ILIKE ${searchPattern} OR
            exercises.description ILIKE ${searchPattern}
          ORDER BY exercises.title ASC
          LIMIT ${itemsPerPage} OFFSET ${offset}
        `;
        
        return exercises.map(exercise => new Exercise(exercise));
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
        FROM exercises
        LEFT JOIN exercisetypes ON exercises.exercisetype = exercisetypes.id
      `;
      return Number(data[0].count);
    }

    // Sanitize and escape the query to prevent SQL injection and special character issues
    const sanitizedQuery = query.trim().replace(/[%_\\]/g, '\\$&');
    const searchPattern = `%${sanitizedQuery}%`;

    try {
      // Try a simpler approach first - search only on text fields
      const data = await sql`SELECT COUNT(*)
        FROM exercises
        LEFT JOIN exercisetypes ON exercises.exercisetype = exercisetypes.id
        WHERE
          exercises.title ILIKE ${searchPattern} OR
          exercises.description ILIKE ${searchPattern} OR
          exercisetypes.name ILIKE ${searchPattern}
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
          FROM exercises
          WHERE
            exercises.title ILIKE ${searchPattern} OR
            exercises."user" ILIKE ${searchPattern} OR
            exercises.description ILIKE ${searchPattern}
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
      const exercises = await sql`select * from exercises;`;
      return exercises;
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch exercises.');
    }
  }

  static async fetchFiltered(query: string, currentPage: number) {
    try {
      const ITEMS_PER_PAGE = 6;
      const exercises = await Exercise.findFiltered(query, currentPage, ITEMS_PER_PAGE);
      return exercises.map(exercise => exercise.toTableFormat());
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch exercises.');
    }
  }

  static async fetchPages(query: string) {
    try {
      const ITEMS_PER_PAGE = 6;
      const totalCount = await Exercise.countFiltered(query);
      const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
      return totalPages;
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch total number of exercises.');
    }
  }

  static async fetchById(id: string) {
    try {
      const exercise = await Exercise.findById(id);
      return exercise?.toFormData();
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch exercise.');
    }
  }
}
