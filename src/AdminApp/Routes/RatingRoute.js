import express from 'express';
const router = express.Router();
import RatingController from '../Controllers/RatingController';

router.post('/rating',RatingController.createRating);
router.put('/rating/:ratingId',RatingController.updateRating);
router.get('/rating',RatingController.listRatings);
router.get('/rating/:ratingId',RatingController.listRating);
router.delete('/rating/:ratingId',RatingController.deleteRating);
router.get('/rating/feedback/list',RatingController.listFeedbacks);
export default router;