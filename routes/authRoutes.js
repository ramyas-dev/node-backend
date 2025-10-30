import express from 'express';
import { LoginUser, testLogin } from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.post('/', LoginUser);
authRouter.get('/',testLogin);

export default authRouter;