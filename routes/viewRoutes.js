const express = require('express')
const authController = require('../controllers/authController');
const viewsController = require('../controllers/viewsController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();



router.get('/',bookingController.createBookingCheckout,authController.isLoggedIn,viewsController.getOverview);

router.get('/tour/:slug',authController.isLoggedIn,viewsController.getTour)

router.get('/login',authController.isLoggedIn,viewsController.getLoginForm);

router.get('/me',authController.protect,viewsController.getAccount);

router.get('/my-tours',authController.protect,viewsController.getMyTours);

router.post('/submit-user-data',authController.protect,viewsController.updateUserData);

module.exports = router;

