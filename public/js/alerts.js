export const hideAlert = () => {
   const el = document.querySelector('.alert');
   if (el) el.parentElement.removeChild(el);
   // “remove the .alert element from its parent” → which is <body>.
}


//type is success or error
export const showAlert = (type,msg) => {
   hideAlert();
   const markup = `<div class="alert alert--${type}">${msg}</div>`;
   //document.querySelector('body') = It is a JavaScript method used to select HTML elements on a web page
   document.querySelector('body').insertAdjacentHTML('afterbegin',markup);
   window.setTimeout(hideAlert,5000);
}