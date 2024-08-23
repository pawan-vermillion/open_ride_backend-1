const { body, validationResult } = require('express-validator');


const cancelBookingValidator = () => {
    return [
        body('cancelReason').exists().withMessage('Cancel Reason is required').notEmpty()
            .withMessage("Cancel Reason cannot be empty "),
        body("userType")
            .exists()
            .withMessage("UserType is required")
            .notEmpty()
            .withMessage("UserType cannot be empty ")
            .isIn(["Admin", "Partner", "User"])
            .withMessage("UserType mus be one of ['Admin','Partner','User']")
    ]

}

const bookingValidate = (req,res,next)=>{
    const error = validationResult(req);

    if(error.isEmpty())
        return next();

    const extractdErrors =[];
    error.array().map((error) => extractdErrors.push(error.msg));
    return res.status(422).json({message : extractdErrors[0]})

    
}

module.exports = {
    cancelBookingValidator,
    bookingValidate,
};
