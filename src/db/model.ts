import pool from "./db";

interface QueryParams {
  [key: string]: any;
}

export async function customSQL(
  query: string,
  values: any[] = []
): Promise<any[]> {
  try {
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error("Database query error:", error);
    throw new Error("Failed to execute SQL query");
  }
}

export abstract class BaseModel<T extends QueryParams> {
  public tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  async findAll(): Promise<T[]> {
    const query = `SELECT * FROM ${this.tableName}`;
    const result = await pool.query(query);
    return result.rows as T[];
  }

  async findAllWithPagination(limit: number, page: number): Promise<T[]> {
    const offset = (page - 1) * limit;
    const query = `SELECT * FROM ${this.tableName} LIMIT $1 OFFSET $2`;
    const result = await pool.query(query, [limit, offset]);
    return result.rows as T[];
  }

  async create(data: T): Promise<T> {
    const columns = Object.keys(data).join(", ");
    const placeholders = Object.keys(data)
      .map((_, idx) => `$${idx + 1}`)
      .join(", ");
    const values = Object.values(data);

    const query = `
      INSERT INTO ${this.tableName} (${columns})
      VALUES (${placeholders})
      RETURNING *;
    `;
    const result = await pool.query(query, values);
    return result.rows[0] as T;
  }

  async findBy(column: keyof T, value: any): Promise<T | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE ${String(
      column
    )} = $1`;
    const result = await pool.query(query, [value]);
    return result.rows[0] ? (result.rows[0] as T) : null;
  }

  async findMany(column: keyof T, value: any): Promise<T[]> {
    const query = `SELECT * FROM ${this.tableName} WHERE ${String(
      column
    )} = $1`;
    const result = await pool.query(query, [value]);
    return result.rows as T[];
  }

  async update(
    column: keyof T,
    value: any,
    data: Partial<T>
  ): Promise<T | null> {
    const updates = Object.keys(data)
      .map((key, idx) => `${key} = $${idx + 1}`)
      .join(", ");
    const values = [...Object.values(data), value];

    const query = `
      UPDATE ${this.tableName}
      SET ${updates}
      WHERE ${String(column)} = $${values.length}
      RETURNING *;
    `;
    const result = await pool.query(query, values);
    return result.rows[0] ? (result.rows[0] as T) : null;
  }

  async delete(column: keyof T, value: any): Promise<T | null> {
    const query = `DELETE FROM ${this.tableName} WHERE ${String(
      column
    )} = $1 RETURNING *`;
    const result = await pool.query(query, [value]);
    return result.rows[0] ? (result.rows[0] as T) : null;``
  }

  async customQuery(query: string, values?: any[]): Promise<any[]> {
    try {
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      throw new Error(
        "Failed to execute custom query: " + (error as Error).message
      );
    }
  }
}
