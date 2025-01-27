const PartnerService = require("../services/shared/partnerService");
const { uploadToCloudinary } = require("../../shared/config/multer");

class PartnerController {
  getPartners = async (req, res, next) => {
    try {
      const partnerId = req.user.id;

      const result = await PartnerService.getPartners({ partnerId });

      return res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };
  updatePartner = async (req, res) => {
    try {
      const PartnerId = req.user.id;
      const partnerData = req.body;
      console.log("log in controller 1 ",partnerData.profileImage)
      console.log("log in controller req.file ",req.file)
      if ( req.file !== undefined && partnerData.profileImage !== null) {
        const profileImageURL = await uploadToCloudinary(
          req,
          req.file.path,
          "profileImage"
        );
        partnerData.profileImage = profileImageURL;
      }
      console.log("log inside the contriller 2  ",partnerData.profileImage)

      const result = await PartnerService.updatePartner(partnerData, PartnerId);
      console.log("reult in controller ",partnerData)
      return res.status(201).json({
        message: "Update Successfully",

        result,
      });
    } catch (error) {
      console.log(error)
      return res.status(404).json({ message: error.message });
    }
  };
}
module.exports = new PartnerController();
