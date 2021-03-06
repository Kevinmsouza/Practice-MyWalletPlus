import * as financialEventRepositories from '../repositories/financialEventRepositories.js';

async function getHistoryByUser({ user }) {
    const result = await financialEventRepositories.getFinancialEventsByUserId({ userId: user.id });
    if (result === 'error') {
        return false;
    }
    return result;
}

function calculateTotal({ history }) {
    const sum = history.reduce((total, event) => (
        event.type === 'INCOME' ? total + event.value : total - event.value
    ), 0);
    return sum;
}

async function createNewEvent({ user, value, type }) {
    const result = await financialEventRepositories.createNewEvent({
        userId: user.id,
        value,
        type,
    });
    return !!result;
}

export {
    getHistoryByUser,
    calculateTotal,
    createNewEvent,
};
