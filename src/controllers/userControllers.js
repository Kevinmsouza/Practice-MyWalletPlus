import * as userServices from '../services/userServices.js';

async function signUp(req, res) {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.sendStatus(400);
    }

    if (await userServices.checkExistingUserWithGivenEmail({ email })) {
        return res.sendStatus(409);
    }

    if (await userServices.createUser({ name, email, password })) {
        return res.sendStatus(201);
    }
    return res.sendStatus(500);
}

async function signIn(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.sendStatus(400);
    }

    if (!await userServices.checkPasswordCompatibility({ email, password })) {
        return res.sendStatus(401);
    }

    const token = userServices.signToken({ email });
    if (token) {
        return res.send({ token });
    }
    return res.sendStatus(500);
}

export {
    signUp,
    signIn,
};
