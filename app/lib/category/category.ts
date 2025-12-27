//Ading a comment to test a direct deploy.

import postgres from 'postgres';
import { CategoryCard, CategoryItem, ExerciseTypesTable, ProgramItem } from '../definitions';

export class Category {
  private sql: postgres.Sql;
  public id: string;
  public name: string;
  public description: string;
  public programs: ProgramItem[];
  public imageUrl: string;

  constructor(data: CategoryItem) {
    this.sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.programs = data.programs;
    this.imageUrl = `${this.name.toLowerCase()}.png`;
  }

  static async findById(id: string): Promise<CategoryItem | null> {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
    
    const result = await sql<CategoryItem[]>`
      SELECT
        categories.id,
        categories.name,
        categories.description
      FROM categories
      WHERE categories.id = ${id}
    `;

    if (result.length === 0) {
      return null;
    }

    const category = result[0];
    const programs = await sql<ProgramItem[]>`
      SELECT
        programs.id,
        programs.name,
        programs.description
        FROM programs
        INNER JOIN programcategory ON programs.id = programcategory.program
        WHERE programcategory.category = ${category.id}
    `;

    return { ...category, imageUrl: `${category.name.toLowerCase()}.png`, programs };
  }

  static async findAll(): Promise<CategoryItem[]> {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

    const data = await sql<CategoryItem[]>`
      SELECT id, name, description
      FROM categories
      ORDER BY name ASC
    `;

    const categories = data.map(category => ({ ...category, imageUrl: `${category.name.toLowerCase()}.png`, programs: [] as ProgramItem[] }));

    for (const category of categories) {
      const programs = await sql<ProgramItem[]>`
      SELECT
        programs.id,
        programs.name,
        programs.description
        FROM programs
        INNER JOIN programcategory ON programs.id = programcategory.program
        WHERE programcategory.category = ${category.id}
      `;
      category.programs = programs;
    }

    return categories;
  }

}