import pool from "./db";
import fs from "fs";

async function seedDatabaseRun() {
  const sqlFiles = fs.readdirSync("./database/sql");

  for (const file of sqlFiles) {
    console.log(`Seeding ${file}...`);

    const filePath = `./db/sql/${file}`;
    const sql = fs.readFileSync(filePath, "utf-8");
    await pool.query(sql);
  }

  console.log(`Seeding completed.`);
}

seedDatabaseRun();
