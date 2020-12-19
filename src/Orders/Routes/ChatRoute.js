import express from 'express';
import ChatController from '../Controllers/ChatController'
import Authorization from '../../../middleware/isAuth';

// intializing express router
const router = express.Router();
router.post('/chat', Authorization, ChatController.chatCreate);
router.post('/chatSearch', Authorization, ChatController.chatList);
router.post('/chatFavourite', Authorization, ChatController.chatFavouriteList);
router.get('/chat/inbox/:receiverId', Authorization, ChatController.inboxList);
router.get('/chat/favourite/:receiverId', Authorization, ChatController.addChatFavourite);
router.put('/chatUpdateUnread', Authorization, ChatController.chatUpdateUnread);
router.put('/chatResetUnread', Authorization, ChatController.chatResetUnread);


export default router;