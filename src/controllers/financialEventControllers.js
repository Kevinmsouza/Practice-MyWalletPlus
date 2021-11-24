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

async function newEvent(req, res) {
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

        const { value, type } = req.body;

        if (!value || !type) {
            return res.sendStatus(400);
        }

        if (!['INCOME', 'OUTCOME'].includes(type)) {
            return res.sendStatus(400);
        }

        if (value < 0) {
            return res.sendStatus(400);
        }

        await connection.query(
            'INSERT INTO "financialEvents" ("userId", "value", "type") VALUES ($1, $2, $3)',
            [user.id, value, type],
        );

        return res.sendStatus(201);
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        return res.sendStatus(500);
    }
}

async function getTotal(req, res) {
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

        const sum = events.rows.reduce((total, event) => (event.type === 'INCOME' ? total + event.value : total - event.value), 0);

        return res.send({ sum });
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        return res.sendStatus(500);
    }
}

export {
    getHistory,
    newEvent,
    getTotal,
};
