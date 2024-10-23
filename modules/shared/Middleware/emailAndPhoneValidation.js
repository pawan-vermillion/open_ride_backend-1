const { body, validationResult } = require("express-validator");

const PhonevalidationRules = () => {
    return [
        body("newPhoneNumber")
            .exists()
            .withMessage("New phoneNumber is required")
            .notEmpty()
            .withMessage("New phoneNumber cannot be empty")
            .isNumeric()
            .withMessage("New phoneNumber is not type number ")
            .isLength({ min: 10, max: 10 })
            .withMessage("New phoneNumber must be 10 digit"),

        body("otp")
            .exists()
            .withMessage("otp is required")
            .notEmpty()
            .withMessage("otp cannot be empty"),
    ];
};

const EmailvalidationRules = () => {
    return [
        body("newEmailAddress")
            .exists()
            .withMessage("Email is required")
            .notEmpty()
            .withMessage("Email cannot be empty")
            .isEmail()
            .withMessage("Email address is not valid"),

        body("otp")
            .exists()
            .withMessage("otp is required")
            .notEmpty()
            .withMessage("otp cannot be empty"),
    ];
};


const EmailAndPhonevalidate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();

    const extractedErrors = [];
    errors.array().map((err) => extractedErrors.push(err.msg));

    return res.status(422).json({ message: extractedErrors[0] });
};



module.exports = {
    PhonevalidationRules,
    EmailvalidationRules,
    EmailAndPhonevalidate,
    // SendOtpEmailvalidationRules
};
