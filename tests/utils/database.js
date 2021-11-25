/* eslint-disable*/
import connection from "../../src/database/database.js";

export async function clearDatabase () {
  await connection.query(`TRUNCATE "financialEvents" RESTART IDENTITY`);
  await connection.query(`DELETE FROM "users"`);
}

export async function closeConnection () {
  await connection.end();
}
