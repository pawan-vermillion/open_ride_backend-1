const WithdrawRequest = require("../../../partner/model/withdrewRequest")
const walletHistory = require("../../../partner/model/walletHistory")
const Partner = require("../../../partner/model/partner")

class WithdrawRequestService {
  async getallWithdrewRequests(filter = "all", limit, page) {
    
  
    try {
      let matchStage = {};
      if (filter === "Approved") {
        matchStage.status = "Approved";
      } else if (filter === "Rejected") {
        matchStage.status = "Rejected";
      } else if (filter === "Pending") {
        matchStage.status = "Pending";
      }
  
      const pageSize = parseInt(limit) || 10;
      const currentPage = parseInt(page) || 1;
      const skip = (currentPage - 1) * pageSize;
  
      const pipeline = [
        { $match: matchStage },
        {
          $lookup: {
            from: 'partners',
            localField: 'partnerId',
            foreignField: '_id',
            as: 'partnerInfo'
          }
        },
        { $unwind: '$partnerInfo' },
        {
          $addFields: {
            availableWalletBalance: {
              $toInt: { $add: ['$partnerInfo.walletBalance', '$amount'] }
            },
            amount: { $toInt: '$amount' }
          }
        },
        {
          $project: {
            _id: 1,
            amount: 1,
            status: 1,
            partnerId: {
              _id: '$partnerInfo._id',
              firstName: '$partnerInfo.firstName',
              lastName: '$partnerInfo.lastName',
              emailAddress: '$partnerInfo.emailAddress',
              phoneNumber: '$partnerInfo.phoneNumber',
            },
            availableWalletBalance: 1,
            createdAt: 1,
            updatedAt: 1
          }
        },
        { $skip: skip },
        { $limit: pageSize }
      ];
  
      const countPipeline = [
        { $match: matchStage },
        { $count: 'totalCount' }
      ];
  
      const [totalCountResult, requests] = await Promise.all([
        walletHistory.aggregate(countPipeline),
        walletHistory.aggregate(pipeline)
      ]);
  
      const totalCount = totalCountResult.length > 0 ? totalCountResult[0].totalCount : 0;
  
      return {
        totalCount,
        page: currentPage,
        limit: pageSize,
        requests
      };
  
    } catch (error) {
      throw error;
    }
  }
  

async approvedRequest(requestId) {
  const withdrewRequest = await walletHistory.findById(requestId);

  if (!withdrewRequest || withdrewRequest.status !== "Pending") {
    throw new Error("Invalid request or already processed");
  }

  
  withdrewRequest.status = "Confirmed";
  withdrewRequest.isWithdrewble = true;

  await withdrewRequest.save();

  const partnerId = await Partner.findByIdAndUpdate(
    withdrewRequest.partnerId,
    { $inc: { useableWalletBalance: -withdrewRequest.amount ,walletBalance: -withdrewRequest.amount} },
    { new: true }
  );

  

  

  

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
