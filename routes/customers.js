const express = require("express");
const Customer = require("../models/Customer");
const auth_customer = require("../middleware/auth_customer");
const router = express.Router();
const SMSServices = require("../services/SMSServices");


router.post("/register", async (req, res) => {
  // Create a new customer
  try {
    const { name, mobile, email, pwd } = req.body;

    const customer = new Customer({
      name,
      mobile,
      email,
      pwd,
    });
    await customer.save();
    const token = await customer.generateAuthToken();
    const response = {
      name: customer.name,
      mobile: customer.mobile,
      email: customer.email,
      addresses: customer.addresses,
      token: token,
    };
    res.send({
      status: 1,
      message: "Customer registered successfully.",
      data: response,
    });
  } catch (error) {
    if (error.message.includes("duplicate key")) {
      if (error.message.includes("mobile")) {
        res.send({ status: 0, message: "Mobile already exists.", data: "" });
      } else if (error.message.includes("email")) {
        res.send({ status: 0, message: "Email already exists.", data: "" });
      }
    } else {
      res.send({ status: 0, message: error.message, data: "" });
    }
  }
});

router.post("/loginmobile", async (req, res) => {
  try {
    const { mobile } = req.body;

    const customer = await Customer.loginmobile(mobile);

    if (!customer) {
      return res.send({
        error: "Login failed! Check authentication credentials",
      });
    }
    const token = await customer.generateAuthToken();
    const response = {
      name: customer.name,
      mobile: customer.mobile,
      email: customer.email,
      addresses: customer.addresses,
      token: token,
    };
    res.send({ status: 1, message: "Login successful.", data: response });
  } catch (error) {
    res.send({ status: 0, message: error.message, data: "" });
  }
});

router.post("/getotp", async (req, res) => {
  try {
    const { mobile } = req.body;

    SMSServices.GetOTP(mobile).then(async (response) => {
      res.send({ status: 1, message: "", data: { otp: response } });
    });
  } catch (error) {
    res.send({ status: 0, message: error.message, data: "" });
  }
});

router.post("/checkmobileexists", async (req, res) => {
  try {
    const { mobile, country } = req.body;

    const customer = await Customer.findOne({ mobile });

    if (customer) {
      return res.send({
        status: 0,
        message: "Mobile number already registered.",
        data: "",
      });
    }

    SMSServices.GetOTP(mobile, country).then(async (response) => {
      res.send({ status: 1, message: "", data: { otp: response } });
    });
  } catch (error) {
    res.send({ status: 0, message: error.message, data: "" });
  }
});

router.post("/checkmobilelogin", async (req, res) => {
  try {
    const { mobile, country } = req.body;

    const customer = await Customer.findOne({ mobile });

    if (!customer) {
      return res.send({
        status: 0,
        message: "Mobile number not exists.",
        data: "",
      });
    }

    SMSServices.GetOTP(mobile, country).then(async (response) => {
      res.send({ status: 1, message: "", data: { otp: response } });
    });
  } catch (error) {
    res.send({ status: 0, message: error.message, data: "" });
  }
});
router.post("/logout", auth_customer, async (req, res) => {
  // Log user out of the application
  try {
    req.customer.tokens = req.customer.tokens.filter((token) => {
      return token.token != req.token;
    });
    await req.customer.save();
    res.send({ status: 1, message: "Logout successfully.", data: "" });
  } catch (error) {
    res.send({ status: 0, message: error.message, data: "" });
  }
});
router.post("/update", async (req, res) => {
 
    const {mobile,email,name, addresses } = req.body;

    const customer = await Customer.findOneAndUpdate(
      { mobile: mobile },
      {
        $set: {
          name,
          mobile,
          email,
          addresses
        },
      },
      {
        new: true,
      }
    );

    const token = await customer.generateAuthToken();
    const response = {
      name: customer.name,
      mobile: customer.mobile,
      email: customer.email,
      addresses: customer.addresses,
      token: token,
    };
    res.send({
      status: 1,
      message: "customer updated successfully.",
      data: response,
    });
 
});

module.exports = router;
