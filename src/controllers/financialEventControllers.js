import connection from '../database/database';
import * as financialEventServices from '../services/financialEventServices.js';

async function getHistory(req, res) {
    const { user } = res.locals;

    const history = await financialEventServices.getHistoryByUser({ user });
    if (history) {
        return res.send(history);
    }
    return res.sendStatus(500);
}

async function newEvent(req, res) {
    try {
        const { user } = res.locals;

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
    const { user } = res.locals;

    const history = await financialEventServices.getHistoryByUser({ user });
    if (!history) {
        return res.sendStatus(500);
    }
    const sum = financialEventServices.calculateTotal({ history });
    return res.send({ sum });
}

export {
    getHistory,
    newEvent,
    getTotal,
};
