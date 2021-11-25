/* eslint-disable no-console */
import connection from '../database/database.js';

async function checkExistingUserWithGivenEmail({ email }) {
    try {
        const existingUserWithGivenEmail = await connection.query(`
            SELECT * FROM "users"
            WHERE "email" = $1
        ;`, [email]);
        return existingUserWithGivenEmail.rows;
    } catch (error) {
        console.log(error);
        return 'error';
    }
}

async function createUser({ name, email, password }) {
    try {
        const result = await connection.query(
            'INSERT INTO "users" ("name", "email", "password") VALUES ($1, $2, $3)',
            [name, email, password],
        );
        return result.rowCount;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export {
    checkExistingUserWithGivenEmail,
    createUser,
};
