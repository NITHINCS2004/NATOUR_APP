/* eslint-disable */

import { showAlert  } from './alerts';
import axios from 'axios';
export const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/users/login',
            data: {
                email,
                password
            }
        });
        //console.log(res);
        if(res.data.status === 'success'){
            showAlert('success','Logged successfully');
            window.setTimeout(()=>{
                location.assign('/');
            },1500);
        }
    }
    catch(err){
        //console.log(err.response.data);
        showAlert('error',err.response.data.message);
    }
   
};

export const logout = async () => {
    try {
        //axios is a JavaScript library used to make HTTP requests from your frontend (browser) to your backend (server).
        //axios = Send a GET request to the logout route on the server running at 127.0.0.1 on port 3000
         const res = await axios({
            method:'GET',
            url:'http://127.0.0.1:3000/api/v1/users/logout',

         });
         if(res.data.status = 'success')
         {
            location.reload(true);
         }


    }
    catch(err){
        showAlert('error','Error logging data try again.')
    }
}