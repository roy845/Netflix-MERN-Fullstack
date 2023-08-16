const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) {
        res.status(403).send({ message: "Token is not valid" });
      }

      req.user = user;
      next();
    });
  } else {
    return res.status(401).send({ message: "Forbidden" });
  }
};

module.exports = verifyToken;
