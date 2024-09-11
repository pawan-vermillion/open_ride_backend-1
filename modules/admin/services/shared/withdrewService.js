const WithdrawRequest = require("../../../partner/model/withdrewRequest")
const walletHistory = require("../../../partner/model/walletHistory")
const Partner = require("../../../partner/model/partner")

class WithdrawRequestService {
    async getallWithdrewRequests(filter = "all", limit, page){
        try {
            let query = {};
            if (filter === "approved") {
              query.status = "approved";
          } else if (filter === "rejected") {
              query.status = "rejected";
          } else if (filter === "pending") {
              query.status = "pending";
          }
            
      const pageSize = parseInt(limit) || 10;
      const currentPage = parseInt(page) || 1;
      const skip = (currentPage - 1) * pageSize;

      const countPromise = WithdrawRequest.countDocuments(query).exec();
      const aggregationPipeline = [
        { $match: query },
        { $skip: skip },
        { $limit: pageSize },
        {
          $lookup: {
            from: "partnerwalletbalances", 
            localField: "partnerId",
            foreignField: "partnerId",
            as: "walletBalance",
          },
        },
        {
          $unwind: {
            path: "$walletBalance",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            availableWalletBalance: "$walletBalance.amount",
          },
        },
        {
          $lookup: {
            from: "partner", 
            localField: "partnerId",
            foreignField: "_id",
            as: "partnerInfo",
          },
        },
        {
          $unwind: {
            path: "$partnerInfo",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            partnerName: {
              $concat: ["$partnerInfo.firstName", " ", "$partnerInfo.lastName"]
            },
            profileImagePath: "$partnerInfo.profileImagePath",
            emailAddress: "$partnerInfo.emailAddress",
            phoneNumber: "$partnerInfo.phoneNumber"
          }
        },
        {
          $project: {
            walletBalance: 0, 
            sellerInfo: 0,
          },
        },
      ];
      const requestsPromise = WithdrawRequest.aggregate(aggregationPipeline).exec();

      const [totalCount, requests] = await Promise.all([
        countPromise,
        requestsPromise,
      ]);

      return {
        totalCount,
        currentPage,
        pageSize,
        requests,
      };

        } catch (error) {
            throw error;
        }
    }
    async approvedRequest(requestId) {
      
      const withdrewRequest = await WithdrawRequest.findById(requestId);
      
      if (!withdrewRequest || withdrewRequest.status !== "pending") {
        throw new Error("Invalid request");
      }
      
     
      withdrewRequest.status = "approved";
      
      
      await withdrewRequest.save();
      
      return withdrewRequest;
    }
    async rejectRequest(requestId) {
      try {
        
        const withdrewRequest = await WithdrawRequest.findById(requestId);
        
       
        if (!withdrewRequest || withdrewRequest.status !== "pending") {
          throw new Error("Invalid or already processed request");
        }
        
        
        withdrewRequest.status = "rejected";
        
       
        await withdrewRequest.save();

        const partner = await Partner.findById(withdrewRequest.partnerId);

        if (!partner) {
          throw new Error("Partner not found");
        }
    
 
        partner.walletBalance += withdrewRequest.amount;
    
        
        await partner.save();
        
        return withdrewRequest;
        
      } catch (error) {
        
        throw new Error(`Error rejecting request: ${error.message}`);
      }
    }
    
        
}
module.exports = new  WithdrawRequestService();
