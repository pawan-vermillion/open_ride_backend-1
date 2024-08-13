const otpStore = {}; 
const storeOtp = async (mobileNumber, otp) => {
  otpStore[mobileNumber] = otp;
 
  setTimeout(() => {
    delete otpStore[mobileNumber];
  
  }, 300000); // 5 minutes in milliseconds
};

const getStoredOtp = async (mobileNumber) => {
  const otp = otpStore[mobileNumber];
 
  return otp;
};

const verifyOtp = async (otp, mobileNumber) => {
  const storedOtp = await getStoredOtp(mobileNumber);
 
  return storedOtp === otp;
};

const removeOtp = async (mobileNumber) => {
  delete otpStore[mobileNumber];
 
};

module.exports = {
  storeOtp,
  verifyOtp,
  removeOtp
};
