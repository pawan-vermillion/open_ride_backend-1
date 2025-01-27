const Partner = require("../../model/partner");
const bcrypt = require("bcrypt");
const { generateToken } = require("../../../shared/Service/authenication");
const cloudinary = require("../../../shared/config/cloudinary");
const { uploadToCloudinary } = require("../../../shared/config/multer");

class PartnerService {
  async createPartner({ partnerData }) {
    try {
      const { firstName, lastName, emailAddress, password, phoneNumber } =
        partnerData;

      const exitingPartner = await Partner.findOne({
        $or: [{ emailAddress }, { phoneNumber }],
      });

      if (exitingPartner) {
        const error = new Error("Youre Account Is Already Exists");
        error.statusCode = 409;
        throw error;
      }

      const handelPassword = await bcrypt.hash(password, 10);
      const partner = await Partner.create({
        firstName,
        lastName,
        emailAddress,
        password: handelPassword,
        phoneNumber,
      });

      const token = generateToken(partner, "Partner");

      return {
        message: "Partner create Successfully",
        token,
      };
    } catch (error) {
      throw error;
    }
  }

  async getPartners({ partnerId }) {
    try {
      const partners = await Partner.findById(partnerId).select(
        "-__v -password -updatedAt"
      );
      if (!partners) {
        const error = new Error("Partner not found");
        error.statusCode = 404;
        throw error;
      }

      const roundedPartner = {
        ...partners._doc,
        walletBalance: Math.round(partners.walletBalance),
        useableWalletBalance: Math.round(partners.useableWalletBalance),
      };

      return roundedPartner;
    } catch (error) {
      throw error;
    }
  }

  async updatePartner(partnerData, PartnerId) {
    try {
      const partner = await Partner.findById(PartnerId);
      if (!partner) {
        const error = new Error("Partner not found");
        throw error;
      }
      console.log("this is services  log ",partnerData.profileImage)
    
      if (  partnerData.profileImage &&
        partnerData.profileImage !== "" &&
        partnerData.profileImage !== null) {
        if (partner.profileImage) {
          console.log("log inside the service cloudnary function 1 ",partnerData.profileImage)
          const oldImagePublicId = partner.profileImage
            .split("/")
            .pop()
            .split(".")[0];
          await cloudinary.uploader.destroy(
            `uploads/partner/profile/${oldImagePublicId}`
          );
        }
      } else {
        console.log("log inside the service cloudnary function 2 ",partnerData.profileImage)
        delete partnerData.profileImage;
      }
      console.log("this is last  log ",partnerData.profileImage)

      const updatePartner = await Partner.findByIdAndUpdate(
        PartnerId,
        partnerData,
        { new: true }
      ).select("-__v -password -createdAt -updatedAt");
      return updatePartner;
    } catch (error) {
      console.log(error)
      throw error;
    }
  }
}
module.exports = new PartnerService();
