import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connection from '../database/database.js';
import * as userServices from '../services/userServices.js';

async function signUp(req, res) {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.sendStatus(400);
    }

    if (await userServices.checkExistingUserWithGivenEmail({ email })) {
        return res.sendStatus(409);
    }

    if (await userServices.createUser({ name, email, password })) return res.sendStatus(201);

    return res.sendStatus(500);
}

async function signIn(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.sendStatus(400);
        }

        const user = await connection.query(
            'SELECT * FROM "users" WHERE "email"=$1',
            [email],
        );

        if (!user.rows[0] || !bcrypt.compareSync(password, user.rows[0].password)) {
            return res.sendStatus(401);
        }

        const token = jwt.sign({
            id: user.rows[0].id,
        }, process.env.JWT_SECRET);

        return res.send({
            token,
        });
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        return res.sendStatus(500);
    }
}

export {
    signUp,
    signIn,
};
