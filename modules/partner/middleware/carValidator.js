const { body, validationResult } = require("express-validator");

const CarValidationRules = () => {
    return [
        body("ownerFullName")
            .exists().withMessage("Owner's full name is required")
            .notEmpty().withMessage("Owner's full name cannot be empty"),

        body("numberOfSeat")
            .exists().withMessage("Number of seats is required")
            .notEmpty().withMessage("Number of seats cannot be empty")
            .isNumeric().withMessage("Number of seats must be a numeric value"),

        body("numberOfDoors")
            .exists().withMessage("Number of doors is required")
            .notEmpty().withMessage("Number of doors cannot be empty")
            .isNumeric().withMessage("Number of doors must be a numeric value"),

        body("ac")
            .exists().withMessage("AC status is required")
            .isBoolean().withMessage("AC status must be a boolean value")
            .notEmpty().withMessage("AC status cannot be empty"),

        body("sunRoof")
            .exists().withMessage("sunRoof status is required")
            .isBoolean().withMessage("sunRoof status must be a boolean value")
            .notEmpty().withMessage("sunRoof status cannot be empty"),

        body("fuelType")
            .exists().withMessage("fuelType status is required")
            .notEmpty().withMessage("fuelType status cannot be empty"),

        body("transmission")
            .exists().withMessage("transmission status is required")

            .notEmpty().withMessage("transmission status cannot be empty"),



        body("carNumber")
            .exists().withMessage("Car number is required")
            .notEmpty().withMessage("Car number cannot be empty"),

        body("companyName")
            .exists().withMessage("Company name is required")
            .notEmpty().withMessage("Company name cannot be empty"),

        body("modelName")
            .exists().withMessage("Model name is required")
            .notEmpty().withMessage("Model name cannot be empty"),

        body("rcNumber")
            .exists().withMessage("RC number is required")
            .notEmpty().withMessage("RC number cannot be empty"),

        body("rate")
            .exists().withMessage("Rate is required")
            .notEmpty().withMessage("Rate cannot be empty"),

        body("unit")
            .exists().withMessage("unit is required")
            .notEmpty().withMessage("unit cannot be empty"),

        body("description")
            .exists().withMessage("Description is required")
            .notEmpty().withMessage("Description cannot be empty"),


        body("address")
            .exists().withMessage("Address is required")
            .notEmpty().withMessage("Address cannot be empty"),

        body("latitude")
            .exists().withMessage("Latitude is required")
            .notEmpty().withMessage("Latitude cannot be empty"),

        body("longitude")
            .exists().withMessage("Longitude is required")
            .notEmpty().withMessage("Longitude cannot be empty"),
            
        body("deleteExteriorImage")
            .exists().withMessage("deleteExteriorImage is required"),

        body("deleteInteriorImage")
            .exists().withMessage("deleteExteriorImage is required"),

        body("deleteRcPhoto")
            .exists().withMessage("deleteExteriorImage is required")



    ];
}

const carValidation = (req, res, next) => {
    const error = validationResult(req);

    if (error.isEmpty())
        return next();

    const extractdErrors = [];
    error.array().map((error) => extractdErrors.push(error.msg));
    return res.status(422).json({ message: extractdErrors[0] })


}
module.exports = { CarValidationRules, carValidation };
