import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import {
  getChatUsers,
  searchUsers,
  sendContactRequest,
} from '../controllers/user.controller.js';

const router = express.Router();

 
router.get('/search', protectRoute, searchUsers);

 
router.get('/chats', protectRoute, getChatUsers);

 
router.post('/send-request', protectRoute, sendContactRequest);

export default router;
