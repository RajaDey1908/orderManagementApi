import express from 'express';
import UserController from '../Controllers/UserController';
// intializing express router
const router = express.Router();

router.post('/user', UserController.createUser);
router.get('/user', UserController.listUsers);
router.get('/user/:userId', UserController.listUser);
router.put('/user/:userId', UserController.updateUser);
router.delete('/user/:userId', UserController.deleteUser);
export default router;