import postgres from 'postgres';
import { ExerciseTypeItem, ExerciseTypeForm, ExerciseTypesTable } from './definitions';

export class ExerciseType {
  private sql: postgres.Sql;
  public id: string;
  public name: string;
  public description: string;

  constructor(data: ExerciseTypeItem | ExerciseTypeForm | ExerciseTypesTable) {
    this.sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
  }

  // Instance methods for data transformation
  toFormData(): ExerciseTypeForm {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
    };
  }

  toTableFormat(): ExerciseTypesTable {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
    };
  }

  // Static CRUD methods
  static async create(name: string, description: string): Promise<ExerciseType> {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

    const result = await sql<ExerciseTypeItem[]>`
      INSERT INTO exercisetypes (id, name, description)
      VALUES (gen_random_uuid(), ${name}, ${description})
      RETURNING *
    `;

    return new ExerciseType(result[0]);
  }

  static async findById(id: string): Promise<ExerciseType | null> {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
    
    const result = await sql<ExerciseTypeForm[]>`
      SELECT
        exercisetypes.id,
        exercisetypes.name,
        exercisetypes.description
      FROM exercisetypes
      WHERE exercisetypes.id = ${id}
    `;

    if (result.length === 0) {
      return null;
    }

    return new ExerciseType(result[0]);
  }

  static async update(id: string, name: string, description: string): Promise<ExerciseType> {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

    const result = await sql<ExerciseTypeItem[]>`
      UPDATE exercisetypes
      SET name = ${name}, description = ${description}
      WHERE id = ${id}
      RETURNING *
    `;

    return new ExerciseType(result[0]);
  }

  static async delete(id: string): Promise<void> {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
    
    await sql`DELETE FROM exercisetypes WHERE id = ${id}`;
  }

  static async findAll(): Promise<ExerciseType[]> {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

    const data = await sql<ExerciseTypeItem[]>`
      SELECT *
      FROM exercisetypes
      ORDER BY name ASC
    `;

    return data.map(exerciseType => new ExerciseType(exerciseType));
  }

  static async findFiltered(query: string, page: number, itemsPerPage: number): Promise<ExerciseType[]> {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
    const offset = (page - 1) * itemsPerPage;

    const exerciseTypes = await sql<ExerciseTypesTable[]>`
      SELECT
        exercisetypes.id,
        exercisetypes.name,
        exercisetypes.description
      FROM exercisetypes
      WHERE
        exercisetypes.name ILIKE ${`%${query}%`} OR
        exercisetypes.description ILIKE ${`%${query}%`}
      ORDER BY exercisetypes.name ASC
      LIMIT ${itemsPerPage} OFFSET ${offset}
    `;

    return exerciseTypes.map(exerciseType => new ExerciseType(exerciseType));
  }

  static async countFiltered(query: string): Promise<number> {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

    const data = await sql`SELECT COUNT(*)
      FROM exercisetypes
      WHERE
        exercisetypes.name ILIKE ${`%${query}%`} OR
        exercisetypes.description ILIKE ${`%${query}%`}
    `;

    return Number(data[0].count);
  }

  static async fetchExerciseTypes() {
    try {
      const exerciseTypes = await ExerciseType.findAll();
      return exerciseTypes.map(exerciseType => ({
        id: exerciseType.id,
        name: exerciseType.name,
      }));
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch exercise types.');
    }
  }
  
  static async fetchExerciseTypeById(id: string) {
    try {
      const exerciseType = await ExerciseType.findById(id);
      return exerciseType?.toFormData();
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch exercise type.');
    }
  }
}
