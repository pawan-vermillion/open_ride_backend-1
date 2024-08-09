const{body , validationResult} = require("express-validator")

const PasswordvalidationRule =()=>{
    return[
        body("newPassword")
        .exists()
        .withMessage("New Password Is Required")
        .notEmpty()
        .withMessage("New Password cannot be empty")
        .isLength({min:8})
        .withMessage("New Password must be at least 8 character"),

        body("oldPassword")
        .exists()
        .withMessage("Old Password Is Required")
        .notEmpty()
        .withMessage("Old Password cannot be empty")
        .isLength({min:8})
        .withMessage("Old Password must be at least 8 character"),

        body("userType")
        .exists()
        .withMessage("UserType is required")
        .notEmpty()
        .withMessage("UserType cannot be empty ")
        .isIn(["Admin", "Partner", "User"])
        .withMessage("UserType mus be one of ['Admin','Partner','User']")


    ]

}

const ForgetPasswordValidationRule =()=>{
    return[
        body("phoneNumber")
        .exists()
        .withMessage("PhoneNumber must be Required")
        .notEmpty()
        .withMessage("PhoneNumber cannot be Required")
        .isNumeric()
        .withMessage("PhoneNumber is not type of Number")
        .isLength({min:10  , max:10})
        .withMessage("PhoneNumber must be 10 digit"),

        body("userType")
        .exists()
        .withMessage("UserType is required")
        .notEmpty()
        .withMessage("UserType cannot be empty ")
        .isIn(["Admin", "Partner", "User"])
        .withMessage("UserType mus be one of ['Admin','Partner','User']"),

        body("newPassword")
        .exists()
        .withMessage("NewPassword is required")
        .notEmpty()
        .withMessage("NewPassword cannot be empty")
        .isLength({ min: 6 })
        .withMessage("NewPassword must be at least 6 characters"),

        body("otp")
      .exists()
      .withMessage("OTP is required")
      .notEmpty()
      .withMessage("OTP cannot be empty")
      .isString()
      .withMessage("OTP must be a string")
      .isLength({ min: 6, max: 6 })
      .withMessage("OTP must be exactly 6 characters")
    ]

};

const ForgetpasswordValidate = (req,res,next)=>{
    const error = validationResult(req);

    if(error.isEmpty())
        return next();

    const extractdErrors =[];
    error.array().map((error) => extractdErrors.push(error.msg));
    return res.status(422).json({message : extractdErrors[0]})

    
}

module.exports = {
    PasswordvalidationRule,
    ForgetPasswordValidationRule,
    ForgetpasswordValidate

};