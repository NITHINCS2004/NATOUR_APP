const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    tour:{
        type:mongoose.Schema.ObjectId,
        ref:'Tour',
        required:[true,'Booking must blong to aa tour']
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:[true,'Booking must belong to to aauser']

    },
    price:{
        type:Number,
        require:[true,'Booking must have a pric']
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    paid:{
        type:Boolean,
        default:true
    }
});
bookingSchema.pre(/^find/,function(next){
    this.populate('user').populate({
        path:'tour',
        select:'name'
    });
    next();
})
const Booking = mongoose.model('Booking',bookingSchema);
module.exports = Booking