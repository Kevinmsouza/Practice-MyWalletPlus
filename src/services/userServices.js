import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
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

async function checkPasswordCompatibility({ email, password }) {
    const user = await userRepositories.checkExistingUserWithGivenEmail({ email });
    if (user === 'error' || !user.length) return false;
    return bcrypt.compareSync(password, user[0].password);
}

async function signToken({ email }) {
    const user = await userRepositories.checkExistingUserWithGivenEmail({ email });
    const token = jwt.sign({
        id: user[0].id,
    }, process.env.JWT_SECRET);
    return token;
}

export {
    checkExistingUserWithGivenEmail,
    createUser,
    checkPasswordCompatibility,
    signToken,
};
