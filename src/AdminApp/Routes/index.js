import express from 'express';
import user from './UserRoute';
import admin from './AdminRoute';
import category from './CategoryRoute';
import cms from './CmsRoute';
import email from './EmailRoute';
import setting from './SettingRoute';
import rating from './RatingRoute';
import amenity from './AmenityRoute';
import accessibility from './AccessibilityRoute';
import plan from './PlanRoute';
import car from './CarRoute';
import language from './LanguageRoute';
import exchange from './ExchangeRoute';
// intializing express router
const router = express.Router();
// intializing express with JSON
router.use(express.json());

// Routes starting with specific path...
router.use('/admin-api', admin);
router.use('/user-api', user);
router.use('/category-api', category);
router.use('/cms-api', cms);
router.use('/email-api', email);
router.use('/setting-api', setting);
router.use('/rating-api', rating);
router.use('/amenity-api', amenity);
router.use('/accessibility-api', accessibility);
router.use('/plan-api', plan);
router.use('/car-api', car);
router.use('/language-api', language);
router.use('/exchange-api', exchange);

export default router;