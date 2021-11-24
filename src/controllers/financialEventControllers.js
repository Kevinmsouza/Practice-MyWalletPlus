import jwt from 'jsonwebtoken';
import connection from '../database/database';

async function getHistory(req, res) {
    try {
        const authorization = req.headers.authorization || '';
        const token = authorization.split('Bearer ')[1];

        if (!token) {
            return res.sendStatus(401);
        }

        let user;

        try {
            user = jwt.verify(token, process.env.JWT_SECRET);
        } catch {
            return res.sendStatus(401);
        }

        const events = await connection.query(
            'SELECT * FROM "financialEvents" WHERE "userId"=$1 ORDER BY "id" DESC',
            [user.id],
        );

        return res.send(events.rows);
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        return res.sendStatus(500);
    }
}

export {
    getHistory,
};
