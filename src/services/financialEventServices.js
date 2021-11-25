import * as financialEventRepositories from '../repositories/financialEventRepositories.js';

async function getHistoryByUser({ user }) {
    const result = await financialEventRepositories.getFinancialEventsByUserId({ userId: user.id });
    if (result === 'error') {
        return false;
    }
    return result;
}

export {
    getHistoryByUser,
};
