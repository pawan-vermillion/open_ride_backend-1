const Admin = require("../../admin/model/admin")
const Partner = require("../../partner/model/partner")
const User = require("../../user/model/user")
const { verifyOtp, removeOtp } = require("../../shared/Service/otpService")

const bcrypt = require("bcrypt")

class PasswordService {
    async changePassword({ oldPassword, newPassword, entityId, userType }) {

        try {
            let user;
            if (userType === "Admin") {
                user = await Admin.findById(entityId)
            } else if (userType === "Partner") {
                user = await Partner.findById(entityId)
            } else if (userType === "User") {
                user = await User.findById(entityId)
            } else {
                const error = new Error("Invalid entity type");
                error.statusCode = 400;
                throw error;
            }

            if (!user) {
                const error = new Error(`${userType} not find`)
                error.statusCode = 404;
                throw error;
            }

            const isMatch = await bcrypt.compare(oldPassword, user.password)
            if (!isMatch) {
                const error = new Error("old password is incorrect")
                error.statusCode = 401;
                throw error
            }

            const isNewMatch = await bcrypt.compare(newPassword, user.password)
            if (isNewMatch) {
                const error = new Error("New Password cannot be the same as old Password")
                error.statusCode = 400;
                throw error;
            }

            const handleNewPassword = await bcrypt.hash(newPassword, 10)
            user.password = handleNewPassword;
            await user.save()

            return { message: "Password Changed Successfully..!!" }
        } catch (error) {
            throw error;
        }
    }

    async forgotPassword(newPassword, userType, phoneNumber, otp) {
        try {
            const isOtpValid = await verifyOtp(otp, phoneNumber)
            if (!isOtpValid) {
                return { message: "Invalid  OTP" }
            }

            let user;
            if (userType === "Admin") {
                user = await Admin.findOne({ phoneNumber })
            } else if (userType === "Partner") {
                user = await Partner.findOne({ phoneNumber })
            } else if (userType === "User") {
                user = await User.findOne({ phoneNumber })
            } else {
                const error = new Error("Invalid  UserType");
                error.statusCode = 400;
                throw error;
            }

            if (!user) {
                const error = new Error(`${userType} not find`)
                error.statusCode = 404;
                throw error;
            }

            const isNewCheck = await bcrypt.compare(newPassword, user.password);
            if (isNewCheck) {
                const error = new Error("New Password cannot be the same as old Password")
         
                error.statusCode = 400;
                throw error;
            }
      

            const hashedNewPassword = await bcrypt.hash(newPassword, 10);

            user.password = hashedNewPassword;
            await user.save();
            await removeOtp(phoneNumber);
            return { message: "Forgotton password changed successfully" };


        } catch (error) {
            throw error;
        }
    }
}

module.exports = new PasswordService()