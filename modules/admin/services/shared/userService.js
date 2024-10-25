const User = require("../../../user/model/user")

class UserService {

    async getUser({ limit, page, search }) {
        try {
            const pageSize = parseInt(limit) || 10;
            const currentPage = parseInt(page) || 1;
            const skip = (currentPage - 1) * pageSize;

            const query = {};
            if (search) {
                const searchTerm = search;
                query.$or = [
                    { firstName: { $regex: searchTerm, $options: "i" } },
                    { lastName: { $regex: searchTerm, $options: "i" } },
                    { emailAddress: { $regex: searchTerm, $options: "i" } },
                ];

                if (!isNaN(Number(searchTerm))) {
                    const regex = new RegExp(searchTerm, "i");
                    query.$or.push({
                        $expr: {
                            $regexMatch: {
                                input: { $toString: "$phoneNumber" },
                                regex: regex,
                            },
                        },
                    });
                }
            }

            const users = await User.find(query)
                .select("-__v -password -updatedAt")
                .skip(skip)
                .limit(pageSize);

            const total = await User.countDocuments(query);

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