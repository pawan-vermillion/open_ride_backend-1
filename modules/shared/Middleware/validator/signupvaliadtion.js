const { body, validationResult } = require("express-validator")

const signupvalidationRule = () => {
  return [
    body("firstName")
      .exists()
      .withMessage("firstname is required")
      .notEmpty()
      .withMessage("firstname name cannot be empty"),

    body("lastName")
      .exists()
      .withMessage("lastName is required")
      .notEmpty()
      .withMessage("lastName  cannot be empty"),

    body("emailAddress")
      .exists()
      .withMessage("emailAddress is required")
      .isEmail()
      .withMessage("emailAddress is not valid")
      .notEmpty()
      .withMessage("emailAddress cannot be empty"),

    body("phoneNumber")
      .exists()
      .withMessage("phoneNumber  is required")
      .isNumeric()
      .withMessage("phoneNumber  is not type  number")
      .isLength({ min: 10, max: 10 })
      .withMessage("phoneNumber  is must be  10 digit"),

    body("password")
      .exists()
      .withMessage("password is required")
      .notEmpty()
      .withMessage("password cannot be empty")
      .isLength({ min: 6 })
      .withMessage("password is must be 6 characters"),

    body("otp")
    .exists()
    .withMessage("OTP is required")
    .notEmpty()
    .withMessage("OTP cannot be empty")
    .isString()
    .withMessage("OTP must be a string")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be exactly 6 characters"),
  ];
};

const signupvalidation = (req, res, next) => {

  const errors = validationResult(req);

  if (errors.isEmpty()) {

    return next();
  }

  const extractedErrors = [];
  errors.array().map((error) => extractedErrors.push(error.msg));

  return res.status(422).json({ message: extractedErrors[0] });
};




module.exports = { signupvalidationRule, signupvalidation }