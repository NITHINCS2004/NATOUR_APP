const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Booking = require('../models/bookingModel');


exports.getOverview = catchAsync(async (req, res) => {

  //step 1 = Get tour data from collections



  //build template
  const tours = await Tour.find();



  //render that templates using tour data from setp1 



  res.status(200).render('overview', {
    title: 'All tours',
    tours
  });
});

exports.getTour = catchAsync(async (req, res) => {
  //1) set the data for the requested tour (including reviews and guides)

  // Receives a request with a dynamic slug (like /tour/the-forest-hiker).
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });
  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }

  //2) Build template





  // 3) Render template using data from 1)



  res.status(200).render('tour', {
    title: `${tour.name} tour`,
    tour
  });
});



exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Log into your account'

  });
}

exports.getMyTours = catchAsync(async(req,res,next) =>{
  //1) find all bookings
   const bookings = await Booking.find({user:req.user.id});
   

  //2)find tours with the returned Ids
  const tourIds = bookings.map(el=> el.tour);
  const tours = await Tour.find({_id:{$in: tourIds}});
  res.status(200).render('overview',{
    title:'My Tours',
    tours
  })
});


//below code is used to update the user data without the help of api
exports.updateUserData = async(req,res) => {
  const updatedUser = await User.findByIdAndUpdate(req.user.id,{
    name:req.body.name,
    email:req.body.email
  },{
    new:true,
    runValidators:true
  });
   res.status(200).render('account', {
    title: 'Log into your account',
    user: updatedUser

  });
}