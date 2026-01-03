import express from 'express';
import adminAuth from '../middleware/adminAuth.js';
import { sendNewsletter,subscribe,unsubscribe } from '../controllers/newsletterController.js';


const letterRouter = express.Router();

letterRouter.post('/subscribe', subscribe);
letterRouter.post('/unsubscribe', unsubscribe);
letterRouter.post('/send',adminAuth,sendNewsletter);

export default letterRouter;
