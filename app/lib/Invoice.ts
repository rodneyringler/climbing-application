import postgres from 'postgres';
import { Invoice, InvoiceForm, InvoicesTable, LatestInvoiceRaw } from './definitions';
import { formatCurrency } from './utils';

export class InvoiceClass {
  private sql: postgres.Sql;
  public id: string;
  public customer_id: string;
  public amount: number;
  public date: string;
  public status: 'pending' | 'paid';
  
  // Optional properties for joined queries
  public name?: string;
  public email?: string;
  public image_url?: string;

  constructor(data: Invoice | InvoiceForm | InvoicesTable | LatestInvoiceRaw) {
    this.sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
    this.id = data.id;
    this.customer_id = 'customer_id' in data ? data.customer_id : '';
    this.amount = data.amount;
    this.date = 'date' in data ? data.date : new Date().toISOString().split('T')[0];
    this.status = 'status' in data ? data.status : 'pending';
    
    // Set optional properties if they exist
    if ('name' in data) this.name = data.name;
    if ('email' in data) this.email = data.email;
    if ('image_url' in data) this.image_url = data.image_url;
  }

  // Instance methods for data transformation
  toFormData(): InvoiceForm {
    return {
      id: this.id,
      customer_id: this.customer_id,
      amount: this.toDollars(),
      status: this.status,
    };
  }

  toTableFormat(): InvoicesTable {
    return {
      id: this.id,
      customer_id: this.customer_id,
      name: this.name || '',
      email: this.email || '',
      image_url: this.image_url || '',
      date: this.date,
      amount: this.amount,
      status: this.status,
    };
  }

  formatAmount(): string {
    return formatCurrency(this.amount);
  }

  toDollars(): number {
    return this.amount / 100;
  }

  toCents(): number {
    return this.amount;
  }

  // Static CRUD methods
  static async create(customerId: string, amount: number, status: string): Promise<InvoiceClass> {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    const result = await sql<Invoice[]>`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
      RETURNING *
    `;

    return new InvoiceClass(result[0]);
  }

  static async findById(id: string): Promise<InvoiceClass | null> {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
    
    const result = await sql<InvoiceForm[]>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id}
    `;

    if (result.length === 0) {
      return null;
    }

    const invoice = result[0];
    // Convert amount from cents to dollars for form data
    invoice.amount = invoice.amount / 100;
    
    return new InvoiceClass(invoice);
  }

  static async update(id: string, customerId: string, amount: number, status: string): Promise<InvoiceClass> {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
    const amountInCents = amount * 100;

    const result = await sql<Invoice[]>`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
      RETURNING *
    `;

    return new InvoiceClass(result[0]);
  }

  static async delete(id: string): Promise<void> {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
    
    await sql`DELETE FROM invoices WHERE id = ${id}`;
  }

  static async findLatest(limit: number = 5): Promise<InvoiceClass[]> {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

    const data = await sql<LatestInvoiceRaw[]>`
      SELECT invoices.amount, customers.name, COALESCE(customers.image_url, '/customers/default.png') as image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT ${limit}
    `;

    return data.map(invoice => new InvoiceClass(invoice));
  }

  static async findFiltered(query: string, page: number, itemsPerPage: number): Promise<InvoiceClass[]> {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
    const offset = (page - 1) * itemsPerPage;

    const invoices = await sql<InvoicesTable[]>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${itemsPerPage} OFFSET ${offset}
    `;

    return invoices.map(invoice => new InvoiceClass(invoice));
  }

  static async countFiltered(query: string): Promise<number> {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

    const data = await sql`SELECT COUNT(*)
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
    `;

    return Number(data[0].count);
  }

  static async getStatistics(): Promise<{ paid: number; pending: number; count: number }> {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      invoiceStatusPromise,
    ]);

    const count = Number(data[0][0].count ?? '0');
    const paid = Number(data[1][0].paid ?? '0');
    const pending = Number(data[1][0].pending ?? '0');

    return { paid, pending, count };
  }
}
