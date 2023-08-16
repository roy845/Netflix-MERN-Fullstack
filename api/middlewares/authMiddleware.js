const jwt = require("jsonwebtoken");

//Protected Routes based on token
const verifyToken = async (req, res, next) => {
  try {
    const decode = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET_KEY
    );

    req.user = decode;

    next();
  } catch (error) {
    console.log(error);
  }
};

//admin access
const isAdmin = async (req, res, next) => {
  try {
    const decode = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET_KEY
    );

    console.log(decode);

    if (!decode.isAdmin) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error in admin middleware",
    });
  }
};

module.exports = { verifyToken, isAdmin };
