const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

class PaymentGetWay {

  async  Process(paymentDetails){
        try {
            const paymentIntent = await stripe.paymnetIntents.create({
                amount : paymentDetails.amount,
                paymentMethod : paymentDetails.paymentMethod,
                confirmed : true
            })

            if(paymentIntent.status === "succeded"){
                return {
                    paymentIntentId : paymentIntent.id,
                    message : "Payment Succeefully.!!"
                }
            }else{
                return {
                    success : "Fail" , 
                    message : "Payment Not Complete"
                }
            }
        } catch (error) {
            return {message : error.message}
        }
    }
}

module.exports = new PaymentGetWay();