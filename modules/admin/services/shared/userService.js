const User = require("../../../user/model/user")

class UserService {

    async getUser({ limit, page, search }) {
        try {
            const pageSize = parseInt(limit) || 10;
            const currentPage = parseInt(page) || 1;
            const skip = (currentPage - 1) * pageSize;

            // Search condition add kari che
            const searchCondition = search
                ? {
                    $or: [
                        { name: { $regex: search, $options: "i" } },  // i means case-insensitive
                        { email: { $regex: search, $options: "i" } },
                        { phone: { $regex: search, $options: "i" } }
                    ]
                }
                : {};

            // Users ni query ma search condition add kari
            const users = await User.find(searchCondition)
                .select("-__v -password -updatedAt")
                .skip(skip)
                .limit(pageSize);

            const total = await User.countDocuments(searchCondition); // total ne pan search pramane count kariyu

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