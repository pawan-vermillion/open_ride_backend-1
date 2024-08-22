const {body, validationResult} = require("express-validator")

const favoriteCarValidationRules = () => {
    return[
        body('carId')
        .notEmpty()
        .withMessage("carId is Required")
    ];
}


const validate =(req,res,next) => {
    const error = validationResult(req);
    if(error.isEmpty())
        return next;

    const extractedErrors =[];
    error.array.map(error => extractedErrors.push(error.msg));
    return res.status(422).json({message : extractedErrors[0]})
}
module.exports ={
    favoriteCarValidationRules,
    validate
}
