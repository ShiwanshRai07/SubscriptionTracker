import {Router} from 'express';
import {getUsers , getUser} from '../controllers/user.controller.js';
const userRouter = Router();

userRouter.get('/' , getUsers);

userRouter.get('/:id' , getUser);

userRouter.post('/' , (req,res) => res.send({title : 'CREATE a user'}));

userRouter.put('/:id' , (req,res) => res.send({title : 'UPDATE specifc user'}));

userRouter.delete('/:id' , (req,res) => res.send({title : 'DELETE specifc user'}));


export default userRouter;