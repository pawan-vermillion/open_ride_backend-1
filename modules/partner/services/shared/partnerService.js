const Partner = require("../../model/partner")
const bcrypt = require("bcrypt")
const { generateToken } = require("../../../shared/Service/authenication")
const cloudinary = require("../../../shared/config/cloudinary")




class PartnerService {
    async createPartner({ partnerData }) {
        try {
            const { firstName, lastName, emailAddress, password, phoneNumber } = partnerData

            const exitingPartner = await Partner.findOne({
                $or: [{ emailAddress }, { phoneNumber }]
            })
           
            if (exitingPartner) {
                const error = new Error("Youre Account Is Already Exists")
                error.statusCode = 409
                throw error
            }

            const handelPassword = await bcrypt.hash(password, 10)
            const partner = await Partner.create({
                firstName,
                lastName,
                emailAddress,
                password: handelPassword,
                phoneNumber
            });
          

            const token = generateToken(partner, "Partner");

            return {
                message: "Partner create Successfully",
                token
            }

        } catch (error) {
            throw error;
        }
    }

    async getPartnerById({ PartnerId }) {
        try {
            const partner = await Partner.findById(PartnerId).select("-__v -password -updatedAt");

            if (!partner) {
                const error = new Error("Partner not found");
                error.statusCode = 404;
                throw error;
            }

            return partner;
        } catch (error) {
            throw error;
        }

    }

    async updatePartner(partnerData , PartnerId , amount){
        try {
           
            const partner = await Partner.findById(PartnerId);
        if (!partner) {
            const error = new Error("Partner not found");
            throw error;
        }

         await partner.save();
        if (partnerData.profileImage && partner.profileImage) {
            
            const oldImagePublicId = partner.profileImage.split('/').pop().split('.')[0];

           
            await cloudinary.uploader.destroy(`uploads/partner/profile/${oldImagePublicId}`);
        }

            const updatePartner = await Partner.findByIdAndUpdate(PartnerId , partnerData , {new:true}).select("-__v -password -createdAt -updatedAt");
            return updatePartner
            

        } catch (error) {
            throw error;
        }
    }
}
module.exports = new PartnerService();