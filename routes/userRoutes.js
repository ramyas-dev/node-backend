import express from 'express';
import { getUsers, createUser, downloadUsers, deleteUser } from '../controllers/userController.js';

const UserRouter = express.Router();

UserRouter.get('/users', getUsers)
UserRouter.post('/create-user', createUser)
UserRouter.get('/download', downloadUsers)
UserRouter.delete('/users/:id', deleteUser)

export default UserRouter;