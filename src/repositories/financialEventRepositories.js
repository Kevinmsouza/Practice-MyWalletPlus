/* eslint-disable no-console */
import connection from '../database/database.js';

async function getFinancialEventsByUserId({ userId }) {
    try {
        const events = await connection.query(`
            SELECT * FROM "financialEvents" 
            WHERE "userId" = $1 
            ORDER BY "id" DESC
        ;`, [userId]);
        return events.rows;
    } catch (error) {
        console.log(error);
        return 'error';
    }
}

async function createNewEvent({ userId, value, type }) {
    try {
        const result = await connection.query(`
                INSERT INTO "financialEvents" 
                ("userId", "value", "type")
                VALUES ($1, $2, $3)
            ;`, [userId, value, type]);
        return result.rowCount;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export {
    getFinancialEventsByUserId,
    createNewEvent,
};
