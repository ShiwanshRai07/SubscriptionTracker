import {Router} from 'express';

const userRouter = Router();

userRouter.get('/' , (req,res) => res.send({title : 'GET all users'}));

userRouter.get('/:id' , (req,res) => res.send({title : 'GET specifc user'}));

userRouter.post('/' , (req,res) => res.send({title : 'CREATE a user'}));

userRouter.put('/:id' , (req,res) => res.send({title : 'UPDATE specifc user'}));

userRouter.delete('/:id' , (req,res) => res.send({title : 'DELETE specifc user'}));


export default userRouter;