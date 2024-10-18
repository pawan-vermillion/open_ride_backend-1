const User = require("../../../user/model/user")

class UserService {

    async getUser({ limit, page, search }) {
        try {
            const pageSize = parseInt(limit) || 10;
            const currentPage = parseInt(page) || 1;
            const skip = (currentPage - 1) * pageSize;

            const searchCondition = search
                ? {
                    $or: [
                        { firstName: { $regex: search, $options: "i" } },  
                        { emailAddress: { $regex: search, $options: "i" } },
                        { phoneNumber: { $regex: search, $options: "i" } }
                    ]
                }
                : {};


            const users = await User.find(searchCondition)
                .select("-__v -password -updatedAt")
                .skip(skip)
                .limit(pageSize);

            const total = await User.countDocuments(searchCondition); 

            if (!users) {
                const error = new Error("User not found");
                error.statusCode = 404;
                throw error;
            }

            return {
                page: currentPage,
                limit: pageSize,
                totalUser: total,
                users
            };

        } catch (error) {
            throw error;
        }
    }




    async getUserById(userId) {
        try {
            const user = await User.findById(userId).select("-__v -password -updatedAt");

            if (!user) {
                const error = new Error("User not found");
                error.statusCode = 404;
                throw error;
            }

            return user;
        } catch (error) {
            throw error;
        }

    }

}
module.exports = new UserService();