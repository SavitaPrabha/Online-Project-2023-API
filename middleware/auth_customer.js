const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const data = jwt.verify(token, process.env.JWT_KEY);
    const customer = await Customer.findOne({
      _id: data._id,
      "tokens.token": token,
    });
    if (!customer) {
      throw new Error();
    }
    req.customer = customer;
    req.token = token;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send({ error: "Not authorized to access this resource" });
  }
};
module.exports = auth;
