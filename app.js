const express = require("express");
const { connectMongoDb } = require("./db/connection");
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require('cors');

// Routes
const OtpRoutes = require("./modules/shared/Route/otpRoute");
const adminRoute = require("./modules/admin/routes/shared/adminRoute")
const partnerRoute = require("./modules/partner/Route/partnerRoute")
const userRoute = require("./modules/user/Route/userRoute")
const passwordRoute = require("./modules/shared/Route/passwordRoute");
// const { upload } = require("./modules/shared/config/multer"); 
const bookingRoute = require("./modules/shared/Route/bookingRoute")
const carRoute = require("./modules/shared/Route/carRoute")
const reviewRoute = require("./modules/shared/Route/reviewRoute")
const emailAndPhoneRoute = require("./modules/shared/Route/emailAndPhoneRoute")




const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); 


const PORT = process.env.PORT || 3003;
//  Connect MongoDB

connectMongoDb(process.env.DB_URL)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((error) => console.log(`MongoDB Error ${error}`));

  app.get('/', (req, res) => {
    res.status(200).json("Welcome To The Open Ride Backend 2");
  });

app.use("/api/otp",OtpRoutes)
app.use("/api/admin",adminRoute)
app.use("/api/partner",partnerRoute)
app.use("/api/user",userRoute)
app.use("/api/password", passwordRoute);
app.use("/api/booking",bookingRoute)  
app.use("/api/car",carRoute)
app.use("/api/review",reviewRoute)
app.use("/api/change",emailAndPhoneRoute)


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});




const server = app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}/`);  
});

server.setTimeout(600000); 



// I resolved the issue that was found during testing In
