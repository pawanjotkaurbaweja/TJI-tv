let OTP_endpoint = `https://rusktvapi-dev.akriya.co.in/`;

function onRequestOTP(e) {
  e.preventDefault();
  e.target.disabled = true;
  console.log('Not redirecting');
  let phonenumber = document.getElementById('phonenumber').value;
  let otpForm = document.getElementById('otp-form');
  let data = {
    callingParty: phonenumber
  };
  console.log(data)
  fetch(`${OTP_endpoint}/subsciptionOTP`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(data)
  })
    .then(data => {
      console.log(data.json());
    })
  otpForm.hidden = false;
}

function verifyOTP(e) {

  let phonenumber = document.getElementById('phonenumber').value;
  let otpValue = document.getElementById('otp-input').value;
  let data = {
    callingParty: phonenumber,
    otpValue: otpValue
  };
  console.log(`Verify OTP request ${phonenumber} | ${otpValue}`);
  e.preventDefault();
  fetch(`${OTP_endpoint}/confirmSubOTP`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(data),
  })
    .then(response => response.json())
    .then((response) => {
      console.log(response);
      if (response.isVaidOTP) {
        letUserKnowSomething('OTP Verified. Redirecting..');
        localStorage.setItem('kw_logged_data', JSON.stringify(response.data));
        setTimeout(() => { window.location.href = '/' }, 1000);

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