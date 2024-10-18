const { body, validationResult } = require("express-validator");

const CarValidationRules = () => {
    return [
        body("ownerFullName")
            .exists().withMessage("Owner's  full name is required")
            .isString().withMessage("Owner's full name must be a string"),

        body("numberOfSeat")
            .exists().withMessage("Number of seats is required")
            .isNumeric().withMessage("Number of seats must be a numeric value"),

        body("numberOfDoors")
            .exists().withMessage("Number of doors is required")
            .isNumeric().withMessage("Number of doors must be a numeric value"),

        body("ac")
            .exists().withMessage("AC status is required")
            .isBoolean().withMessage("AC status must be a boolean value"),

        body("sunRoof")
            .exists().withMessage("SunRoof status is required")
            .isBoolean().withMessage("SunRoof status must be a boolean value"),

        body("fuelType")
            .exists().withMessage("Fuel type is required")
            .isString().withMessage("Fuel type must be a string"),

        body("transmission")
            .exists().withMessage("Transmission status is required")
            .isString().withMessage("Transmission status must be a string"),

        body("carNumber")
            .exists().withMessage("Car number is required")
            .isString().withMessage("Car number must be a string"),

        body("companyName")
            .exists().withMessage("Company name is required")
            .isString().withMessage("Company name must be a string"),

        body("modelName")
            .exists().withMessage("Model name is required")
            .isString().withMessage("Model name must be a string"),

        body("rcNumber")
            .exists().withMessage("RC number is required")
            .isString().withMessage("RC number must be a string"),

        body("rate")
            .exists().withMessage("Rate is required"),
            // .isNumeric().withMessage("Rate must be a numeric value"),

        body("unit")
            .exists().withMessage("Unit is required")
            .isString().withMessage("Unit must be a string"),

        body("description")
            .exists().withMessage("Description is required")
            .isString().withMessage("Description must be a string"),

        body("address")
            .exists().withMessage("Address is required")
            .isString().withMessage("Address must be a string"),

        body("latitude")
            .exists().withMessage("Latitude is required")
            .isNumeric().withMessage("Latitude must be a numeric value"),

        body("longitude")
            .exists().withMessage("Longitude is required")
            .isNumeric().withMessage("Longitude must be a numeric value"),
    ];
};

const carValidation = (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        return next();
    }

    const extractedErrors = errors.array().map(err => err.msg);
    req.validationErrors = extractedErrors;

    return res.status(422).json({ errors: extractedErrors[0] });
};

module.exports = { CarValidationRules, carValidation };
