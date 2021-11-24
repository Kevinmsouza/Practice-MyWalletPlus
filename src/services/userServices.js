import bcrypt from 'bcrypt';
import * as userRepositories from '../repositories/userRepositories.js';

async function checkExistingUserWithGivenEmail({ email }) {
    const result = await userRepositories.checkExistingUserWithGivenEmail({ email });
    return !!result.length;
}

async function createUser({ name, email, password }) {
    const hashedPassword = bcrypt.hashSync(password, 12);
    const result = await userRepositories.createUser({ name, email, password: hashedPassword });
    return !!result;
}

export {
    checkExistingUserWithGivenEmail,
    createUser,
};
