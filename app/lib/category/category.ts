import postgres from 'postgres';
import { CategoryItem, ExerciseTypesTable } from '../definitions';

export class Category {
  private sql: postgres.Sql;
  public id: string;
  public name: string;
  public description: string;

  constructor(data: CategoryItem) {
    this.sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
  }

  static async findById(id: string): Promise<Category | null> {
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

    return new Category(result[0]);
  }

  static async findAll(): Promise<Category[]> {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

    const data = await sql<CategoryItem[]>`
      SELECT *
      FROM categories
      ORDER BY name ASC
    `;

    return data.map(category => new Category(category));
  }

  static async findFiltered(query: string, page: number, itemsPerPage: number): Promise<Category[]> {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
    const offset = (page - 1) * itemsPerPage;

    const categories = await sql<CategoryItem[]>`
      SELECT
        categories.id,
        categories.name,
        categories.description
      FROM categories
      WHERE
        categories.name ILIKE ${`%${query}%`} OR
        categories.description ILIKE ${`%${query}%`}
      ORDER BY categories.name ASC
      LIMIT ${itemsPerPage} OFFSET ${offset}
    `;

    return categories.map(category => new Category(category));
  }
/*
  static async countFiltered(query: string): Promise<number> {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

    const data = await sql`SELECT COUNT(*)
      FROM categories
      WHERE
        categories.name ILIKE ${`%${query}%`} OR
        categories.description ILIKE ${`%${query}%`}
    `;

    return Number(data[0].count);
  }
*/
  static async fetchCategories() {
    try {
      const categories = await Category.findAll();
      return categories.map(category => ({
        id: category.id,
        name: category.name,
      }));
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch categories.');
    }
  }
}
