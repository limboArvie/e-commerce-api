const jwt = require("jsonwebtoken");
const secret = "AAL-E-COMMERCE-API";

const createAccessToken = (user) => {
  const data = {
    id: user._id,
    email: user.email,
    isAdmin: user.isAdmin,
    role: user.role,
    isApprovedSeller: user.isApprovedSeller,
  };

  return jwt.sign(data, secret, {});
};

const verifyToken = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(401)
      .send({ error: "Authentication Error: Invalid bearer token." });
  }

  const token = authorization.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .send({ error: "Authentication Error: Invalid bearer token." });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Authentication Error: Failed to authenticate user.",
      });
    } else {
      req.user = decoded;
      next();
    }
  });
};

const verifyAdmin = (req, res, next) => {
  const { isAdmin } = req.user;

  if (!isAdmin) {
    return res
      .status(403)
      .send({ error: "Forbidden: User not allowed to access this resource." });
  }

  next();
};

const verifyNotAdmin = (req, res, next) => {
  const { isAdmin } = req.user;

  if (isAdmin) {
    return res
      .status(403)
      .send({ error: "Forbidden: User not allowed to access this resource." });
  }

  next();
};

const verifySeller = (req, res, next) => {
  const { role, isApprovedSeller } = req.user;

  if (role !== "Seller" || !isApprovedSeller) {
    return res
      .status(403)
      .send({ error: "Forbidden: User not allowed to access this resource." });
  }

  next();
}

module.exports = {
  createAccessToken,
  verifyAdmin,
  verifyNotAdmin,
  verifySeller,
  verifyToken,
};
