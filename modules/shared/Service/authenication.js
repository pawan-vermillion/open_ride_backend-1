const jwt = require("jsonwebtoken")
const secret = "$Open@Ride#@$";

const generateToken = (data , type) => {
    
    return jwt.sign({id:data._id , type:type} ,secret , {expiresIn : "7d"})

}
const verifyToken = (token) => {
    try {
        return jwt.verify(token , secret)
    } catch (error) {
        throw new error('Invalid Token')
    }
}
module.exports = {generateToken ,verifyToken }