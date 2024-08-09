const { verifyToken } = require("../../Service/authenication");

exports.sharedAuthentication = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.id };
    req.type = payload.type;

    // Check if the user type is one of the allowed types
    const allowedTypes = ["Admin", "Partner", "User"];
    
    if (!allowedTypes.includes(payload.type)) {
      return res.status(401).json({
        message: "You are not authorized to access this resource",
      });
    }

    return next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token", error: error.toString() });
  }
};