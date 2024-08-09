const { body, validationResult } = require("express-validator");

const phoneValidationRules = () => {
  return [
    body("phoneNumber")
      .exists()
      .withMessage("PhoneNumber is required")
      .notEmpty()
      .withMessage("PhoneNumber cannot be empty")
      .isNumeric()
      .withMessage("PhoneNumber is not type number ")
      .isLength({ min: 10, max: 10 })
      .withMessage("Phonenumber must be 10 digit"),

    body("emailAddress")
      .exists()
      .withMessage("EmailAddress is required")
      .notEmpty()
      .withMessage("EmailAddress cannot be empty")
      .isEmail()
      .withMessage("Email address is not valid"),

    body("userType")
      .exists()
      .withMessage("UserType is required")
      .notEmpty()
      .withMessage("UserType cannot be empty ")
      .isIn(["Admin", "Partner", "User"])
      .withMessage("UserType mus be one of ['Admin','Partner','User']"),
  ];
};


const phoneValidate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  
  const extractedErrors = []; 
  errors.array().map((error) => extractedErrors.push(error.msg));

  return res.status(422).json({ message: extractedErrors[0] });
};

module.exports = {
  phoneValidationRules,
  phoneValidate,
};