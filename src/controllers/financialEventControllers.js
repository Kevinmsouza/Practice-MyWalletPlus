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
    const { user } = res.locals;

    const { value, type } = req.body;
    if (!value || !type || !['INCOME', 'OUTCOME'].includes(type) || value < 0) {
        return res.sendStatus(400);
    }

    if (financialEventServices.createNewEvent({ user, value, type })) {
        return res.sendStatus(201);
    }
    return res.sendStatus(500);
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
