const User = require("../model/user");
const bcrypt = require("bcrypt");
const { generateToken } = require("../../shared/Service/authenication");
const cloudinary = require("../../shared/config/cloudinary");
const walletBalance = require("./walletBalance");

class UserService {
  async createUser({ userData }) {
    try {
      const { firstName, lastName, emailAddress, password, phoneNumber } =
        userData;
      const exitingUser = await User.findOne({
        $or: [{ emailAddress }, { phoneNumber }],
      });
      if (exitingUser) {
        const error = new Error("Your Account Is Already Exists");
        error.statusCode = 409;
        throw error;
      }

      const handlePassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        firstName,
        lastName,
        emailAddress,
        password: handlePassword,
        phoneNumber,
      });
      const token = generateToken(user, "User");
      return {
        message: "User create Succeessfully",
        token,
      };
    } catch (error) {
      throw error;
    }
  }

  async getUserById(userId) {
    try {
      const user = await User.findById(userId).select(
        "-__v -password -createdAt -updatedAt"
      );
      if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
      }

      const roundUser = {
        ...user._doc,
        walletBalance: Math.round(user.walletBalance),
      };
      return roundUser;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(userData, userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
      }
      
  
      // Handle profile image update
      if (userData.profileImage && userData.profileImage !== "null") {
        if (user.profileImage) {
          const oldImagePublicId = user.profileImage.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(
            `uploads/user/profile/${oldImagePublicId}`
          );
        }
      } else {
        delete userData.profileImage; // Ensure no overwriting with null
      }
  
      const updatedUser = await User.findByIdAndUpdate(userId, userData, {
        new: true,
      }).select("-__v -password -createdAt -updatedAt");
  
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }
  
}
module.exports = new UserService();
