const {model , Schema, default: mongoose} = require("mongoose")
const bcrypt = require('bcrypt')
const {generateToken} = require("../../shared/Service/authenication")

const partnerSchema = new Schema({
    firstName:{
        type:String,
        require:true,
    },
    lastName:{
        type:String,
        require:true
    },
    emailAddress:{
        type:String,
        require:true
    },
    phoneNumber:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true
    },
    profileImage:{
        type:String,
        require:true
    },
    walletBalance: {
        type: Number,
        default: 0
    }

},
    {timestamps : true}
)
partnerSchema.statics.matchPasswordGenerateToken = async function(phone , password){
    try {
        const partner = await this.findOne({phoneNumber:phone})
        if(!partner){
            throw new Error("Partner not found")

        }
        const isPasswordCorrect = await bcrypt.compare(password, partner.password);
        if (!isPasswordCorrect) {
            
            throw new Error("Incorrect Password");
            
        }
       
            const Token = generateToken(partner , "Partner")
            return Token

         } catch (error) {
           
        throw error;
    }
}
const Partner = mongoose.model("Partner", partnerSchema)
module.exports = Partner