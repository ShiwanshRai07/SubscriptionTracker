import {Router} from 'express';
import {createSubscription, getUserSubscription} from "../controllers/subscription.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const subscriptionRouter = Router();

subscriptionRouter.get('/', (req,res) => res.send({title : 'Get All Subscriptions'}));

subscriptionRouter.get('/:id', (req,res) => res.send({title : 'Get subscription details'}));


subscriptionRouter.post('/', authorize , createSubscription );

subscriptionRouter.put('/:id', (req,res) => res.send({title : 'Update Subscriptions'}));

subscriptionRouter.delete('/', (req,res) => res.send({title : 'Delete Subscriptions'}));

subscriptionRouter.get('/user/:id', authorize , getUserSubscription );

subscriptionRouter.put('/:id/cancel', (req,res) => res.send({title : 'Cancel Subscriptions'}));

subscriptionRouter.get('/upcomming-renewals', (req,res) => res.send({title : 'Get Upcoming Renewals'}));


export default subscriptionRouter;