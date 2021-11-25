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

export {
    getFinancialEventsByUserId,
};
