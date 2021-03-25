function checkIfUserLoggedInOrRedirect() {
    let lastLocalstorageValue = localStorage.getItem('kw_logged_data');
    console.log(lastLocalstorageValue);

    if(lastLocalstorageValue == undefined) {
        //user needs to be redirected;
        console.log(`user will be redirected`);
        if(window.location.href.indexOf('/account') < 0 && window.location.href.indexOf('/login') < 0) {  //only if not already on login or account page
            window.location.href = '/account/'
        }
    } else {
        console.log(`We have user data. Let's update relevent DOM`);
    }
}

setInterval(checkIfUserLoggedInOrRedirect, 10000)       //For PROD
// checkIfUserLoggedInOrRedirect();                     // Only to test