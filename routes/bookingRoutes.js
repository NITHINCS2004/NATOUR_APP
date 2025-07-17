const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');



const router = express.Router();

router.use(authController.protect);


//this route is used to create the create the stripe checkout seesion for the users
router.get('/checkout-session/:tourId',authController.protect,bookingController.getCheckoutSession);

router.use(authController.restrictTo('admin','lead-guide'));

router.route('/').get(bookingController.getAllBookings)
                 .post(bookingController.createBooking);

router.route('/:id').get(bookingController.getBooking).patch(bookingController.updateBooking)
                    .delete(bookingController.deleteBooking);

module.exports = router;
