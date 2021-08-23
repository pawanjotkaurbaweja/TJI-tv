function checkIfUserLoggedInOrRedirect() {
    let lastLocalstorageValue = localStorage.getItem('kw_logged_data');
    console.log(lastLocalstorageValue);

    if (lastLocalstorageValue == undefined) {
        //user needs to be redirected;
        // console.log(`user will be redirected`);
        if (window.location.href.indexOf('/account') < 0
            && window.location.href.indexOf('/login') < 0
            && window.location.href.indexOf('/plan') < 0
            && window.location.href.indexOf('/sub') < 0) {  //only if not already on login or account page
            window.location.href = '/sub/'
        }
    } else {
        // console.log(`We have user data. Let's update relevent DOM`);
    }
}


setInterval(checkIfUserLoggedInOrRedirect, 15000)       //For PROD
// checkIfUserLoggedInOrRedirect();                     // Only to test