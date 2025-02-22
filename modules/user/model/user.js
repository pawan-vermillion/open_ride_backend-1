const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const { generateToken } = require("../../shared/Service/authenication")
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        require: true
    },
    emailAddress: {
        type: String,
        require: true
    },
    phoneNumber: {
        type: Number,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    profileImage: {
        type: String,
        require: true
    },
    walletBalance: {
        type: Number,
        required: false,
        default: 0
    },
    rating: {
        type: Number,
        required: false,
        default: 0,
    }
}, { timestamps: true })

userSchema.statics.matchPasswordGenerateToken = async function (phone, password) {
    try {
        const user = await this.findOne({ phoneNumber: phone });

        if (!user) {
            throw new Error("User not found");
        }


        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            throw new Error("Incorrect Password");
        }

        const token = generateToken(user, "User");
        return token;
    } catch (error) {
        throw error;
    }
};
userSchema.statics.calculateAverageRating = async function (userId) {
    const reviews = await this.model("UserReviews").find({ userId });

    if (reviews.length === 0) return;


    const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;


    await this.findByIdAndUpdate(userId, { rating: averageRating });
};


const User = mongoose.model('User', userSchema);
module.exports = User;
