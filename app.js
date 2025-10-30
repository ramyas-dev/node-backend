import express from 'express';
import UserRouter from './routes/userRoutes.js';
import authRouter from './routes/authRoutes.js';
import FileUploadRouter from './routes/fileUploadRoutes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', FileUploadRouter)
app.use('/', UserRouter)
app.use('/login', authRouter)

export default app;