import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connection from '../database/database.js';

async function signUp(req, res) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.sendStatus(400);
        }

        const existingUserWithGivenEmail = await connection.query(
            'SELECT * FROM "users" WHERE "email"=$1',
            [email],
        );

        if (existingUserWithGivenEmail.rows[0]) {
            return res.sendStatus(409);
        }

        const hashedPassword = bcrypt.hashSync(password, 12);

        await connection.query(
            'INSERT INTO "users" ("name", "email", "password") VALUES ($1, $2, $3)',
            [name, email, hashedPassword],
        );

        return res.sendStatus(201);
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        return res.sendStatus(500);
    }
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
