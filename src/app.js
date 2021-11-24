import express from 'express';
import cors from 'cors';
import * as userControllers from './controllers/userControllers.js';
import * as financialEventControllers from './controllers/financialEventControllers.js';
import authentication from './middlewares/auth.js';

const app = express();
app.use(cors());
app.use(express.json());

// USER
app.post('/sign-up', userControllers.signUp);
app.post('/sign-in', userControllers.signIn);

// FINANCIAL EVENT
app.post('/financial-events', authentication, financialEventControllers.newEvent);
app.get('/financial-events', authentication, financialEventControllers.getHistory);
app.get('/financial-events/sum', authentication, financialEventControllers.getTotal);

export default app;
