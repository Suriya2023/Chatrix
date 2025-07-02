import express from 'express';
import {
    sendContactRequest,
    getContactRequests,
    getAcceptedContacts,
    acceptContactRequest,
    isContactApproved
} from '../controllers/user.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/send-request', protectRoute, sendContactRequest);
router.get('/accepted', protectRoute, getAcceptedContacts);  
router.get('/requests', protectRoute, getContactRequests);
router.post('/accept-request/:id', protectRoute, acceptContactRequest);
router.get('/is-contact/:id', protectRoute, isContactApproved);

export default router;
