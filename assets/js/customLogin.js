
    function onRequestOTP(e) {
        e.preventDefault();
        e.target.disabled = true;
        console.log('Not redirecting');
        let phonenumber = document.getElementById('phonenumber').value;
        let otpForm = document.getElementById('otp-form');
        otpForm.hidden = false;
    }

    function verifyOTP(e) {

      console.log(`Verify OTP request`);
      e.preventDefault();
      fetch('OTP_VERIFY_API_ENDPOINT')
        .then(response => response.json)
        .then((response) => {
          if (response.isVaidOTP) {

          } else {
            letUserKnowSomething('OTP seems to be invalid. Please try again.'); 
            document.getElementById('requestOTPBtn').disabled = false;

          }
        })
      
    }

    function requestOTPfirebaseFunctionTrigger(phoneNumber) {
        
    }

    function letUserKnowSomething(text) {
      document.getElementById('sendUserInfo').innerHTML = `
        <p> ${text} </p>
        `
    }