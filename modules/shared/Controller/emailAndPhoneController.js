const OtpService = require('../../shared/Service/otpService')
const User = require("../../user/model/user");
const Partner = require("../../partner/model/partner");
const Admin = require("../../admin/model/admin");

class EmailAndPhoneController {

    changePhoneNumber = async (req, res) => {
        try {
            const { newPhoneNumber, otp } = req.body;
            const userId = req.user.id;
            const userType = req.type;

            let Model;
            if (userType === "User") {
                Model = User;
            } else if (userType === "Partner") {
                Model = Partner;
            } else if (userType === "Admin") {
                Model = Admin;
            } else {
                return res.status(400).json({ message: `Invalid ${userType}` });
            }

            if (otp !== "123456") {
                return res.status(400).json({
                    message: 'Invalid OTP.',
                });
            }

            const user = await Model.findById(userId);
            if (!user) {
                return res.status(404).json({
                    message: 'User not found.',
                });
            }
            

            if (user.phoneNumber === newPhoneNumber) {
                return res.status(400).json({
                    message: 'New phone number cannot be the same as the current phone number.',
                });
            }

            const updatedUser = await Model.findByIdAndUpdate(
                userId,
                { phoneNumber: newPhoneNumber },
                { new: true, runValidators: true } 
            );
            

            return res.status(200).json({
                success : true,
                message: 'Phone number updated successfully.',
            });

        } catch (error) {
            if (error.code === 11000 && error.keyValue.phoneNumber) {
                return res.status(400).json({
                    message: 'This phone number is already registered with another account.',
                });
            }

            return res.status(500).json({
                message: 'Failed to update phone number. Please try again later.',
                error: error.message,
            });
        }
    };


    sendOtpForEmail = async (req, res) => {
        try {
            const userId = req.user.id;
            const userType = req.type;

            let Model;
            if (userType === "User") {
                Model = User;
            } else if (userType === "Partner") {
                Model = Partner;
                
            } else if (userType === "Admin") {
                Model = Admin;
            } else {
                return res.status(400).json({ message: `Invalid ${userType}` });
            }

            // Fetch user details using the Model and userId
            const user = await Model.findById(userId);

            // Check if user exists
            if (!user) {
                return res.status(404).json({ message: `${userType} not found.` });
            }

            // Call OTP service with user's emailAddress
            await OtpService.sendOtp({
                emailAddress: user.emailAddress,
                userType,
                isForgot: true
            });

            return res.status(200).json({
                message: 'OTP sent successfully.',
            });

        } catch (error) {
            return res.status(400).json({
                message: 'Failed to send OTP. Please try again later.',
                error: error.message,
            });
        }
    };







    changeEmailAddress = async (req, res) => {
        try {
            // const userId = req.user.id;
            const userType = req.type;
            const userId = req.user.id;

            const { newEmailAddress, otp } = req.body;

            let Model;
            if (userType === "User") {
                Model = await User.findById({ _id: userId });
            } else if (userType === "Partner") {
                Model = await Partner.findById({ _id: userId });
            } else if (userType === "Admin") {
                Model = await Admin.findById({ _id: userId });
            } else {
                return res.status(400).json({ message: `Invalid user type: ${userType}` });
            }

            // Verify the OTP


            const emailAddress = Model.emailAddress

            const isOtpValid = await OtpService.verifyOtp(otp, emailAddress);

            if (!isOtpValid) {
                return res.status(400).json({
                    message: 'OTP is invalid',
                });
            }

            // Check if the new email is the same as the current one
            if (Model.emailAddress === newEmailAddress) {
                return res.status(400).json({ message: 'You cannot change to the same email.' });
            }

            // Update the email address
            Model.emailAddress = newEmailAddress;
            await OtpService.removeOtp(emailAddress)
            await Model.save();  // Ensure you await the save operation

            return res.status(200).json({
                message: 'Email changed successfully.',
            });
        } catch (error) {
            return res.status(400).json({
                message: 'Failed to change email. Please try again later.',
                error: error.message,
            });
        }
    };



}

module.exports = new EmailAndPhoneController();