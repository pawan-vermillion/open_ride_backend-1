const PartnerService = require("../services/shared/partnerService");

class PartnerController {
  getPartner = async (req, res, next) => {
    try {
      const PartnerId = req.user.id;
      const result = await PartnerService.getPartnerById({ PartnerId });
      return res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ message: error.message })
    }
  }
  updatePartner = async(req,res)=>{
    try {
      const PartnerId = req.user.id;
      const partnerData = req.body

      const result = await PartnerService.updatePartner(partnerData , PartnerId)
      return res.status(201).json({message:"Partner Update Successfully" , result })
     
    } catch (error) {
      return res.status(404).json({message:error.message})
    }
  }
}
module.exports = new PartnerController()