import pool from "./db";
import fs from "fs";

async function seedDatabaseRun() {
  let sqlFiles = fs.readdirSync("./src/db/sql");

  // Move 'seed.sql' to the front if it exists
  sqlFiles = sqlFiles.sort((a, b) => {
    if (a === "seed.sql") return -1;
    if (b === "seed.sql") return 1;
    return 0;
  });

  for (const file of sqlFiles) {
    console.log(`Seeding ${file}...`);

    const filePath = `./src/db/sql/${file}`;
    const sql = fs.readFileSync(filePath, "utf-8");
    await pool.query(sql);
  }

  console.log(`Seeding completed.`);
}

seedDatabaseRun();
