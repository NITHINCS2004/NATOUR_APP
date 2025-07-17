const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');
const Booking = require('./../models/bookingModel');
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY
});


/*
exports.getCheckoutSession= catchAsync( async(req,res,next) => {
     //1)Get currentely booked tour
      const tour = await Tour.findById(req.params.tourId);


     //2)create the checkout session
     const session = await razorpay.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url:`${req.protocol}://${req.get('host')}/`,
        cancel_url:`${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        line_items:[
            {
                name:`${tour.name} Tour`,
                description: tour.summary,
                images: [`http://127.0.0.1:3000/img/tours/${tour.imageCover}`],
                amount: tour.price*100,
                currency:'INR',
                quantity:1
            }
        ]
     })

     //3)send it to the client
     res.status(200).json({
        status:'success',
        session
     });

});*/

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);
    const tourId = req.params.tourId;
  console.log('Tour ID received:', tourId);

  if (!tour) return next(new AppError('Tour not found', 404));

  // 2) Create the Razorpay order
  const order = await razorpay.orders.create({
    amount: tour.price * 100, // amount in paisa
    currency: 'INR',
    receipt: `receipt_order_${tour.id}`,
    notes: {
      tour_name: `${tour.name} Tour`,
      description: tour.summary,
      image: `http://127.0.0.1:3000/img/tours/${tour.imageCover}`,
      email: req.user.email,
      tour_id: req.params.tourId
    }
  });

  // 3) Send it to the client (keeping same field structure as Stripe-style)
  res.status(200).json({
    status: 'success',
    session: {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      payment_method_types: ['card', 'netbanking', 'wallet', 'upi'], // Razorpay supports multiple
      success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
      cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
      customer_email: req.user.email,
      client_reference_id: req.params.tourId,
      line_items: [
        {
          name: `${tour.name} Tour`,
          description: tour.summary,
          images: [`http://127.0.0.1:3000/img/tours/${tour.imageCover}`],
          amount: tour.price * 100,
          currency: 'INR',
          quantity: 1
        }
      ]
    }
  });
});

exports.createBookingCheckout = catchAsync( async (req,res,next) => {
  //This is only temporaray because it is unsecure: everyone can make booking without paying
  const {tour,user,price} = req.query;
  if(!tour && !user && !price) return next();

  await Booking.create({tour,user,price});
  res.redirect(req.originalUrl.split('?')[0]);
});


exports.createBooking =factory.createOne(Booking);
exports.getBooking =factory.getOne(Booking);
exports.getAllBookings =factory.getAll(Booking);
exports.updateBooking =factory.updateOne(Booking);
exports.deleteBooking =factory.deleteOne(Booking);
