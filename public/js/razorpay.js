
/*
const razorpayKey = 'rzp_test_ZI0RWBkCXGIpWe';
import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async tourId => {
    console.log(tourId);
    //1)get the checkout sessions form api
    try{
    const session = await axios(
        `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
       
    );
    console.log(session);

    //2)create checkout form + charge credit card

     await razorpayKey.redirectToCheckout({
           sessionId:session.data.session.id
     })

     }catch(err){
        console.log(err);
        showAlert('error',err);
     }
}*/
import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async tourId => {
  try {
    // 1. Get checkout session from the backend
    const sessionRes = await axios.get(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );
    const session = sessionRes.data.session;

    // 2. Create Razorpay payment object
    const options = {
      key: 'rzp_test_ZI0RWBkCXGIpWe', // Your Razorpay test key
      amount: session.amount, // Amount in paisa
      currency: session.currency,
      name: session.name,
      description: session.description,
      image: '/img/logo-white.png',
      order_id: session.id, // Razorpay order ID from your backend
      handler: function (response) {
        // Handle payment success — you can send response.razorpay_payment_id to your server
        showAlert('success', 'Payment successful!');
      },
      prefill: {
        name: session.customer_name,
        email: session.customer_email
      },
      theme: {
        color: '#00b894'
      }
    };

    const razorpay = new Razorpay(options);
    razorpay.open();
  } catch (err) {
    console.error(err);
    showAlert('error', 'Payment failed. Please try again.');
  }
};
