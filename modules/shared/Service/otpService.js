const otpStore = {}; 
const storeOtp = async (mobileNumber, otp) => {
  otpStore[mobileNumber] = otp;
  // console.log(`Stored OTP for ${mobileNumber}: ${otp}`)
  setTimeout(() => {
    delete otpStore[mobileNumber];
    // console.log(`OTP for ${mobileNumber} expired and removed.`); 
  }, 300000); // 5 minutes in milliseconds
};

const getStoredOtp = async (mobileNumber) => {
  const otp = otpStore[mobileNumber];
  // console.log(`Retrieved OTP for ${mobileNumber}: ${otp}`); 
  return otp;
};

const verifyOtp = async (otp, mobileNumber) => {
  const storedOtp = await getStoredOtp(mobileNumber);
  console.log(`Stored OTP: ${storedOtp}, Provided OTP: ${otp}`); 
  return storedOtp === otp;
};

const removeOtp = async (mobileNumber) => {
  delete otpStore[mobileNumber];
  // console.log(`OTP for ${mobileNumber} removed.`); 
};

module.exports = {
  storeOtp,
  verifyOtp,
  removeOtp
};
