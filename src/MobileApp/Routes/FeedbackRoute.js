import express from 'express';
const router = express.Router();
import FeedbackController from '../Controllers/FeedbackController';
import Authentication from '../../../middleware/isAuth';


router.post('/feedback', Authentication, FeedbackController.createFeedback);
// router.put('/rating/:ratingId', Authentication, FeedbackController.updateRating);
// router.get('/rating',Authentication, FeedbackController.listRatings);
router.get('/feedback/:carId',Authentication, FeedbackController.DetailsFeedback);
// router.delete('/rating/:ratingId',Authentication, FeedbackController.deleteRating);
// router.get('/rating/feedback/list',Authentication, FeedbackController.listFeedbacks);
export default router;